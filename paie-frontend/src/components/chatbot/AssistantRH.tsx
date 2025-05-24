
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, PlusCircle, Send, Filter, Clock, Bot, User, ChevronRight, Download, Calendar, FileText, ArrowUpRight, X, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ChatMessageType, MessageActionType, SimulationResultType } from '@/types/chatbot';
import { mockMessages, mockSuggestions, generateAIResponse } from '@/utils/chatbot/mockData';

interface AssistantRHProps {
  isEmployee?: boolean;
}

const AssistantRH: React.FC<AssistantRHProps> = ({ isEmployee = false }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessageType[]>(mockMessages);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>(mockSuggestions);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSubmitMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    const newUserMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'delivered'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage, isEmployee);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        actions: aiResponse.actions,
        status: 'delivered'
      }]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };
  
  // Handle action click
  const handleActionClick = (action: MessageActionType) => {
    switch (action.type) {
      case 'download':
        toast({
          title: "Téléchargement démarré",
          description: `${action.label} est en cours de téléchargement...`,
        });
        break;
      case 'create':
        toast({
          title: "Création",
          description: `${action.label} a été créé avec succès.`,
        });
        break;
      case 'navigate':
        toast({
          description: `Navigation vers ${action.label}...`,
        });
        break;
      default:
        toast({
          description: `Action ${action.label} exécutée.`,
        });
    }
  };
  
  return (
    <>
      {/* Assistant Icon Button - Elegant Style */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-blue-primary to-blue-primary/90 hover:from-blue-primary/90 hover:to-blue-primary transition-all duration-300 p-0 flex items-center justify-center border border-white/20"
          aria-label="Ouvrir l'assistant RH"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
      
      {/* Assistant Chat Window - Elegant Style */}
      {isOpen && (
        <Card className={cn(
          "fixed z-50 flex flex-col transition-all duration-300 shadow-xl border border-border/30",
          isExpanded 
            ? "top-4 left-4 right-4 bottom-4 rounded-xl" 
            : "bottom-6 right-6 w-[380px] max-h-[600px] h-[80vh] rounded-xl overflow-hidden"
        )}>
          {/* Header with gradient background */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-primary to-blue-primary/90 text-primary-foreground px-4 py-3 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 bg-white/10 border border-white/20 p-1">
                <Bot className="h-5 w-5 text-white" />
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">
                  {isEmployee ? "Assistant RH" : "Assistant IA Paie"}
                </h3>
                <p className="text-xs text-primary-foreground/90 font-light">
                  {isEmployee ? "Réponses instantanées à vos questions" : "Aide à la décision RH"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isEmployee ? (
            // Simple chat interface for employees - Refined style
            <div className="flex flex-col flex-1 overflow-hidden bg-card">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex flex-col max-w-[85%] space-y-1 shadow-sm",
                        message.sender === 'user' 
                          ? "ml-auto bg-gradient-to-br from-blue-primary to-blue-primary/90 text-primary-foreground rounded-t-2xl rounded-bl-2xl rounded-br-sm" 
                          : "bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 border border-border/20 rounded-t-2xl rounded-br-2xl rounded-bl-sm"
                      )}
                    >
                      <p className="text-sm p-3">{message.content}</p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-3 pb-2">
                          {message.actions.map((action, idx) => (
                            <Button 
                              key={idx} 
                              size="sm" 
                              variant={message.sender === 'user' ? "outline" : "secondary"}
                              className={cn(
                                "h-8 text-xs rounded-full",
                                message.sender === 'user' ? "bg-white/10 hover:bg-white/20 border-white/20" : ""
                              )}
                              onClick={() => handleActionClick(action)}
                            >
                              {action.icon && (
                                <span className="mr-1">
                                  {action.icon === 'download' && <Download className="h-3 w-3" />}
                                  {action.icon === 'calendar' && <Calendar className="h-3 w-3" />}
                                  {action.icon === 'file' && <FileText className="h-3 w-3" />}
                                </span>
                              )}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      <span className="text-xs opacity-70 self-end px-3 pb-1.5">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex max-w-[85%] rounded-2xl p-3 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 border border-border/20">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-blue-primary/60 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-blue-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 rounded-full bg-blue-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                {suggestions.length > 0 && (
                  <div className="mb-3 overflow-auto">
                    <div className="flex gap-2 pb-2 whitespace-nowrap">
                      {suggestions.map((suggestion, idx) => (
                        <Button 
                          key={idx} 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs rounded-full border-blue-primary/30 hover:bg-blue-primary/10 hover:text-blue-primary"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <form 
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitMessage();
                  }}
                >
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 rounded-full bg-white dark:bg-gray-900 border-blue-primary/20 focus-visible:ring-blue-primary/30"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="rounded-full bg-gradient-to-r from-blue-primary to-blue-primary/90 hover:from-blue-primary/90 hover:to-blue-primary h-10 w-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            // Advanced interface for HR professionals - Refined style
            <div className="flex flex-col flex-1 overflow-hidden bg-card">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b">
                  <TabsList className="h-12 w-full rounded-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <TabsTrigger value="chat" className="flex-1 data-[state=active]:bg-blue-primary/10 data-[state=active]:text-blue-primary rounded-none">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Assistant
                    </TabsTrigger>
                    <TabsTrigger value="simulation" className="flex-1 data-[state=active]:bg-blue-primary/10 data-[state=active]:text-blue-primary rounded-none">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Simulation
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-blue-primary/10 data-[state=active]:text-blue-primary rounded-none">
                      <Clock className="mr-2 h-4 w-4" />
                      Historique
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id}
                          className={cn(
                            "flex flex-col max-w-[85%] space-y-1 shadow-sm",
                            message.sender === 'user' 
                              ? "ml-auto bg-gradient-to-br from-blue-primary to-blue-primary/90 text-primary-foreground rounded-t-2xl rounded-bl-2xl rounded-br-sm" 
                              : "bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 border border-border/20 rounded-t-2xl rounded-br-2xl rounded-bl-sm"
                          )}
                        >
                          <p className="text-sm p-3">{message.content}</p>
                          {message.actions && message.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-3 pb-2">
                              {message.actions.map((action, idx) => (
                                <Button 
                                  key={idx} 
                                  size="sm" 
                                  variant={message.sender === 'user' ? "outline" : "secondary"}
                                  className={cn(
                                    "h-8 text-xs rounded-full",
                                    message.sender === 'user' ? "bg-white/10 hover:bg-white/20 border-white/20" : ""
                                  )}
                                  onClick={() => handleActionClick(action)}
                                >
                                  {action.icon && (
                                    <span className="mr-1">
                                      {action.icon === 'download' && <Download className="h-3 w-3" />}
                                      {action.icon === 'calendar' && <Calendar className="h-3 w-3" />}
                                      {action.icon === 'file' && <FileText className="h-3 w-3" />}
                                    </span>
                                  )}
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                          <span className="text-xs opacity-70 self-end px-3 pb-1.5">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex max-w-[85%] rounded-2xl p-3 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 border border-border/20">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-blue-primary/60 animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-blue-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 rounded-full bg-blue-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-3 border-t bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    {suggestions.length > 0 && (
                      <div className="mb-3 overflow-auto">
                        <div className="flex gap-2 pb-2 whitespace-nowrap">
                          {suggestions.map((suggestion, idx) => (
                            <Button 
                              key={idx} 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-xs rounded-full border-blue-primary/30 hover:bg-blue-primary/10 hover:text-blue-primary"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <form 
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitMessage();
                      }}
                    >
                      <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Posez votre question RH ou paie..."
                        className="flex-1 rounded-full bg-white dark:bg-gray-900 border-blue-primary/20 focus-visible:ring-blue-primary/30"
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        className="rounded-full bg-gradient-to-r from-blue-primary to-blue-primary/90 hover:from-blue-primary/90 hover:to-blue-primary h-10 w-10"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="simulation" className="flex-1 p-4 overflow-auto">
                  <Card className="border border-border/20 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-primary/10 to-blue-primary/5 p-3 border-b border-border/20">
                      <h3 className="text-lg font-semibold">Simulation Paie & RH</h3>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Type de simulation</label>
                          <select className="w-full rounded-md border border-blue-primary/20 bg-background px-3 py-2 focus:border-blue-primary/30 focus:outline-none focus:ring-1 focus:ring-blue-primary/20">
                            <option>Embauche nouvelle</option>
                            <option>Augmentation</option>
                            <option>Prime exceptionnelle</option>
                            <option>Licenciement</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Salaire brut mensuel</label>
                          <Input 
                            type="number" 
                            defaultValue={12000} 
                            className="border-blue-primary/20 focus-visible:ring-blue-primary/30"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Date d'effet</label>
                            <Input 
                              type="date" 
                              defaultValue="2024-06-01" 
                              className="border-blue-primary/20 focus-visible:ring-blue-primary/30"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Fonction</label>
                            <Input 
                              type="text" 
                              defaultValue="Développeur Front-End" 
                              className="border-blue-primary/20 focus-visible:ring-blue-primary/30"
                            />
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-blue-primary to-blue-primary/90 hover:from-blue-primary/90 hover:to-blue-primary">
                          Exécuter la simulation
                        </Button>
                        
                        <div className="mt-6 border-t pt-4">
                          <h4 className="font-semibold mb-2">Résultat simulation</h4>
                          <div className="rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-border/30 p-3 space-y-2 shadow-sm">
                            <div className="flex justify-between">
                              <span className="text-sm">Salaire brut:</span>
                              <span className="font-medium">12 000,00 MAD</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Cotisations salariales:</span>
                              <span className="font-medium text-destructive">- 1 366,80 MAD</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Impôt sur le revenu (IR):</span>
                              <span className="font-medium text-destructive">- 842,64 MAD</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                              <span className="text-sm font-semibold">Salaire net:</span>
                              <span className="font-semibold text-green-cta">9 790,56 MAD</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                              <span className="text-sm">Coût employeur:</span>
                              <span className="font-medium">13 836,00 MAD</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-3 gap-2">
                            <Button variant="outline" size="sm" className="rounded-full border-blue-primary/30 hover:bg-blue-primary/10 hover:text-blue-primary">
                              <Download className="h-4 w-4 mr-1" />
                              Exporter
                            </Button>
                            <Button size="sm" className="rounded-full bg-gradient-to-r from-blue-primary to-blue-primary/90 hover:from-blue-primary/90 hover:to-blue-primary">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              Appliquer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="flex-1 p-4 overflow-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">Historique des requêtes</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full border-blue-primary/30 hover:bg-blue-primary/10 hover:text-blue-primary"
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        Filtrer
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Card key={i} className="overflow-hidden border border-border/20 hover:shadow-md transition-shadow">
                          <div className="p-3 flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant={i % 2 === 0 ? "default" : "secondary"} className={cn(
                                  "px-1.5 py-0 text-xs rounded-full",
                                  i % 2 === 0 
                                    ? "bg-blue-primary/20 text-blue-primary hover:bg-blue-primary/30" 
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200"
                                )}>
                                  {i % 2 === 0 ? "Simulation" : "Question RH"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(Date.now() - i * 86400000).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <p className="text-sm font-medium mt-1">
                                {i % 2 === 0 
                                  ? "Simulation augmentation Salma EL KADIRI" 
                                  : "Calcul des congés payés après démission"}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-blue-primary/10 hover:text-blue-primary"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default AssistantRH;
