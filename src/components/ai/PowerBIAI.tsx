import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Send, Mic, MicOff, Sparkles, Brain, 
  TrendingUp, BarChart3, PieChart, LineChart as LineChartIcon, Lightbulb,
  Wand2, Search, BookOpen, HelpCircle, Zap, Eye,
  Calendar, Users, DollarSign, ShoppingCart, Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  visualization?: any;
  insights?: AIInsight[];
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'forecast';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  visualization?: any;
}

interface QuickInsight {
  id: string;
  title: string;
  description: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  chart?: any;
}

const PowerBIAI: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your Power BI AI assistant. I can help you with data analysis, create visualizations, and provide insights. What would you like to explore today?',
      timestamp: new Date(),
      suggestions: [
        'Show me sales trends for the last quarter',
        'Which products are performing best?',
        'Create a revenue forecast',
        'Analyze customer segmentation'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [quickInsights] = useState<QuickInsight[]>([
    {
      id: '1',
      title: 'Revenue Growth',
      description: 'Monthly revenue increased by 15% compared to last month',
      value: '$2.4M',
      change: '+15%',
      trend: 'up',
      chart: [
        { month: 'Jan', value: 2000 },
        { month: 'Feb', value: 2100 },
        { month: 'Mar', value: 2400 }
      ]
    },
    {
      id: '2',
      title: 'Customer Acquisition',
      description: 'New customer signups showing strong momentum',
      value: '1,429',
      change: '+23%',
      trend: 'up',
      chart: [
        { month: 'Jan', value: 1200 },
        { month: 'Feb', value: 1350 },
        { month: 'Mar', value: 1429 }
      ]
    },
    {
      id: '3',
      title: 'Product Performance',
      description: 'Electronics category leading in sales volume',
      value: '45%',
      change: '+8%',
      trend: 'up'
    },
    {
      id: '4',
      title: 'Regional Analysis',
      description: 'North America showing highest conversion rates',
      value: '3.2%',
      change: '+0.5%',
      trend: 'up'
    }
  ]);

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'trend',
      title: 'Seasonal Sales Pattern Detected',
      description: 'Sales data shows a consistent 20% increase every fourth quarter over the past 3 years.',
      confidence: 92,
      impact: 'high'
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Unusual Drop in Mobile Traffic',
      description: 'Mobile website traffic decreased by 35% last week, which is atypical for this time of year.',
      confidence: 87,
      impact: 'medium'
    },
    {
      id: '3',
      type: 'correlation',
      title: 'Marketing Spend & Revenue Correlation',
      description: 'Strong positive correlation (0.84) between digital marketing spend and monthly revenue.',
      confidence: 95,
      impact: 'high'
    },
    {
      id: '4',
      type: 'forecast',
      title: 'Q4 Revenue Projection',
      description: 'Based on historical patterns, Q4 revenue is projected to reach $3.2M (±15%).',
      confidence: 78,
      impact: 'high'
    }
  ]);

  const suggestedQuestions = [
    {
      category: 'Sales Analysis',
      icon: <TrendingUp size={16} />,
      questions: [
        'What are the top 5 performing products this month?',
        'Show me sales by region for the last quarter',
        'Which sales rep has the highest conversion rate?',
        'Compare this year\'s sales to last year'
      ]
    },
    {
      category: 'Customer Insights',
      icon: <Users size={16} />,
      questions: [
        'What is our customer churn rate?',
        'Show customer lifetime value by segment',
        'Which customers are at risk of churning?',
        'Analyze customer acquisition trends'
      ]
    },
    {
      category: 'Financial Metrics',
      icon: <DollarSign size={16} />,
      questions: [
        'Show profit margin trends over time',
        'What is our return on advertising spend?',
        'Compare costs vs revenue by department',
        'Forecast next quarter\'s revenue'
      ]
    },
    {
      category: 'Operations',
      icon: <Activity size={16} />,
      questions: [
        'Show inventory turnover rates',
        'Which products have the highest demand?',
        'Analyze supply chain efficiency',
        'Show capacity utilization trends'
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputText),
        timestamp: new Date(),
        suggestions: [
          'Tell me more about this trend',
          'Show me a different visualization',
          'What factors might be causing this?',
          'How can we improve these numbers?'
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('sales') || lowerQuestion.includes('revenue')) {
      return 'Based on your sales data, I can see that revenue has grown 15% this quarter. The top-performing region is North America with $1.2M in sales. Electronics and clothing categories are driving most of the growth. Would you like me to create a detailed breakdown visualization?';
    } else if (lowerQuestion.includes('customer') || lowerQuestion.includes('churn')) {
      return 'Your customer metrics show a healthy retention rate of 85%. I notice that customers who engage with your mobile app have 40% higher lifetime value. The main churn risk factors are: low engagement in first 30 days and lack of support interactions. Shall I create a customer segmentation analysis?';
    } else if (lowerQuestion.includes('forecast') || lowerQuestion.includes('predict')) {
      return 'Based on historical trends and current patterns, I predict a 12% revenue increase next quarter. Key factors influencing this forecast include seasonal patterns, marketing campaign performance, and product launch schedules. The confidence interval is ±8%. Would you like me to show the detailed forecast model?';
    } else {
      return 'I\'ve analyzed your data and found several interesting patterns. Let me break down what I discovered and suggest some visualizations that might help you understand the trends better. What specific aspect would you like me to focus on?';
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      toast({
        title: "Voice Input Started",
        description: "Speak your question now...",
      });

      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputText("Show me sales trends for this quarter");
        toast({
          title: "Voice Input Complete",
          description: "Question captured successfully",
        });
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp size={16} className="text-blue-500" />;
      case 'anomaly': return <Eye size={16} className="text-red-500" />;
      case 'correlation': return <Zap size={16} className="text-yellow-500" />;
      case 'forecast': return <Calendar size={16} className="text-green-500" />;
      default: return <Lightbulb size={16} className="text-purple-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center space-x-3">
          <Brain size={20} className="text-purple-600" />
          <h1 className="text-lg font-semibold">Power BI AI Assistant</h1>
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-blue-50">
            <Sparkles size={12} className="mr-1" />
            AI Powered
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <BookOpen size={16} className="mr-1" />
            Help
          </Button>
          <Button variant="outline" size="sm">
            <HelpCircle size={16} className="mr-1" />
            FAQ
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start h-10 bg-gray-50 rounded-none border-b">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle size={16} />
            <span>AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Lightbulb size={16} />
            <span>Quick Insights</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center space-x-2">
            <Search size={16} />
            <span>Q&A Explorer</span>
          </TabsTrigger>
          <TabsTrigger value="smart-narrative" className="flex items-center space-x-2">
            <Wand2 size={16} />
            <span>Smart Narrative</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl flex space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}>
                          {message.type === 'user' ? 'U' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg p-4 ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                        <p className="text-sm">{message.content}</p>
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs opacity-75">Suggested follow-ups:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                className="block w-full text-left text-xs p-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask me anything about your data..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                      onClick={handleVoiceInput}
                    >
                      {isListening ? (
                        <MicOff size={16} className="text-red-500 animate-pulse" />
                      ) : (
                        <Mic size={16} className="text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI-Generated Quick Insights</h2>
              <Button variant="outline" size="sm">
                <Sparkles size={16} className="mr-1" />
                Refresh Insights
              </Button>
            </div>

            {/* Quick Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickInsights.map((insight) => (
                <Card key={insight.id} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{insight.value}</div>
                      <div className={`text-sm ${insight.trend === 'up' ? 'text-green-600' : insight.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {insight.change} from last period
                      </div>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                      {insight.chart && (
                        <div className="h-12 mt-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={insight.chart}>
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={insight.trend === 'up' ? '#10b981' : '#ef4444'} 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed AI Insights */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Advanced AI Insights</h3>
              {aiInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className={getConfidenceColor(insight.confidence)}>
                              {insight.confidence}% Confidence
                            </Badge>
                            <Badge 
                              variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                            >
                              {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {insight.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-1" />
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="flex-1 p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Ask Questions About Your Data</h2>
              <p className="text-gray-600">Choose from popular questions or ask your own</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestedQuestions.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      {category.icon}
                      <span>{category.category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.questions.map((question, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors text-sm"
                          onClick={() => {
                            setActiveTab('chat');
                            setInputText(question);
                          }}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="smart-narrative" className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Smart Narrative</h2>
              <Button>
                <Wand2 size={16} className="mr-1" />
                Generate Story
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sales Performance Summary</h3>
                  <div className="prose max-w-none">
                    <p>
                      Your sales performance this quarter shows <strong>strong momentum</strong> with revenue reaching 
                      <span className="text-green-600 font-semibold"> $2.4M</span>, representing a 
                      <span className="text-green-600 font-semibold"> 15% increase</span> from the previous quarter.
                    </p>
                    
                    <p>
                      The <strong>Electronics category</strong> continues to be your top performer, contributing 
                      <span className="font-semibold"> 45% of total sales</span>. This is particularly noteworthy 
                      given the seasonal trends we typically see in this category.
                    </p>
                    
                    <p>
                      <strong>Customer acquisition</strong> has accelerated significantly, with 
                      <span className="text-blue-600 font-semibold"> 1,429 new customers</span> added this quarter - 
                      a <span className="text-blue-600 font-semibold"> 23% increase</span> from last quarter. 
                      The majority of these customers came through your digital marketing channels.
                    </p>
                    
                    <p>
                      Looking at regional performance, <strong>North America</strong> leads with the highest 
                      conversion rates at <span className="font-semibold"> 3.2%</span>, while 
                      <strong>European markets</strong> show the fastest growth rate at 
                      <span className="text-purple-600 font-semibold"> 28% quarter-over-quarter</span>.
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Key Recommendations:</h4>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Increase marketing spend in European markets to capitalize on growth momentum</li>
                        <li>• Expand electronics inventory ahead of Q4 seasonal demand</li>
                        <li>• Implement retention campaigns for new customers acquired this quarter</li>
                        <li>• Consider launching similar products in underperforming categories</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PowerBIAI;