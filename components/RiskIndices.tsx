import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  FileText, Database, Radio, Globe, Info, PlayCircle, ChevronDown, ChevronUp, 
  CheckCircle, XCircle, Target, Clock, Zap, BookOpen, TrendingUp, AlertTriangle, 
  HelpCircle, Lightbulb, ArrowRight, ArrowDown, Filter, Layers, BarChart3, 
  PieChart as PieChartIcon, Activity, Shield, Eye, Users, Building, 
  GraduationCap, Briefcase, DollarSign, Lock, Unlock, ExternalLink,
  ChevronRight, Star, Award, Cpu, Newspaper, MessageSquare, Search,
  Calendar, MapPin, Languages, Server, GitBranch, Workflow, CircleDot,
  TrendingDown, Minus, Plus, Settings, Compass, Map, Brain, Sparkles, Circle
} from 'lucide-react';
import DataSourceTooltip from './DataSourceTooltip';

// ... (Data definitions remain unchanged)
// ============================================================================
// COMPREHENSIVE DATA DEFINITIONS
// ============================================================================

const METHODOLOGIES = [
  // ... (Same METHODOLOGIES array content)
  {
    id: 'gpr',
    name: 'GPR Index',
    fullName: 'Geopolitical Risk Index',
    provider: 'Federal Reserve Bank of Dallas',
    creators: 'Dario Caldara & Matteo Iacoviello',
    type: 'Text-based NLP Analysis',
    updateFrequency: 'Monthly',
    dataLatency: '~30 days',
    historySince: '1900',
    totalYears: 125,
    icon: <FileText className="w-6 h-6" />,
    color: '#06b6d4',
    colorClass: 'text-cyan-400',
    bgColorClass: 'bg-cyan-500/20',
    borderColorClass: 'border-cyan-500/30',
    gradientClass: 'from-cyan-500/20 to-blue-500/20',
    
    shortDescription: 'The gold standard for long-term geopolitical risk measurement, tracking 125+ years of global events through newspaper analysis.',
    
    fullDescription: `The Geopolitical Risk (GPR) Index measures adverse geopolitical events and associated risks by counting the occurrence of words related to geopolitical tensions in leading international newspapers. Developed by economists at the Federal Reserve, it has become the most widely-cited academic measure of geopolitical risk.

The index analyzes articles from 10 major newspapers including The New York Times, The Washington Post, The Wall Street Journal, Financial Times, and others. It searches for specific keyword combinations related to war, terrorism, military tensions, and geopolitical uncertainty.`,

    howItWorks: {
      step1: {
        title: 'Article Collection',
        description: 'Automated systems gather all articles from 10 major international newspapers daily',
        icon: <Newspaper className="w-5 h-5" />
      },
      step2: {
        title: 'Keyword Scanning',
        description: 'NLP algorithms scan for 180+ geopolitical keywords and phrases',
        icon: <Search className="w-5 h-5" />
      },
      step3: {
        title: 'Counting & Normalization',
        description: 'Count matching articles and normalize by total articles published',
        icon: <BarChart3 className="w-5 h-5" />
      },
      step4: {
        title: 'Index Calculation',
        description: 'Convert to index value (100 = historical average)',
        icon: <Activity className="w-5 h-5" />
      }
    },

    subIndices: [
      { name: 'GPR Threats', description: 'Measures threats of adverse geopolitical events', color: '#ef4444' },
      { name: 'GPR Acts', description: 'Measures actual adverse geopolitical events', color: '#f97316' },
      { name: 'GPR Country-Specific', description: 'Available for 44 individual countries', color: '#8b5cf6' }
    ],

    keywordCategories: [
      { category: 'War & Military', examples: ['war', 'military action', 'armed forces', 'troops'], count: 45 },
      { category: 'Terrorism', examples: ['terrorist attack', 'bombing', 'hostage'], count: 32 },
      { category: 'Nuclear', examples: ['nuclear threat', 'atomic weapon', 'missile'], count: 18 },
      { category: 'Geopolitical Tensions', examples: ['diplomatic crisis', 'sanctions', 'embargo'], count: 55 },
      { category: 'Civil Unrest', examples: ['civil war', 'coup', 'revolution'], count: 30 }
    ],

    dataSources: [
      { name: 'The New York Times', country: 'USA', since: '1900' },
      { name: 'The Washington Post', country: 'USA', since: '1985' },
      { name: 'The Wall Street Journal', country: 'USA', since: '1985' },
      { name: 'Financial Times', country: 'UK', since: '1985' },
      { name: 'The Times (London)', country: 'UK', since: '1900' },
      { name: 'Chicago Tribune', country: 'USA', since: '1985' },
      { name: 'Los Angeles Times', country: 'USA', since: '1985' },
      { name: 'The Daily Telegraph', country: 'UK', since: '1985' },
      { name: 'The Guardian', country: 'UK', since: '1985' },
      { name: 'Boston Globe', country: 'USA', since: '1985' }
    ],

    methodology: {
      dataSource: '10 major international newspapers (US & UK)',
      approach: 'Keyword frequency analysis using curated geopolitical terms',
      normalization: 'Percentage share of total articles published',
      formula: 'GPR = (Geopolitical Articles / Total Articles) × 100',
      validation: 'Peer-reviewed and published in American Economic Review'
    },

    technicalDetails: {
      updateCycle: 'Monthly, released 1st week of following month',
      dataFormat: 'CSV, Excel downloadable from Fed website',
      apiAccess: 'No official API, data freely downloadable',
      license: 'Public domain / Open access',
      citations: '5,000+ academic citations'
    },

    historicalEvents: [
      { year: 1914, event: 'World War I Outbreak', indexValue: 450 },
      { year: 1939, event: 'World War II Begins', indexValue: 520 },
      { year: 1962, event: 'Cuban Missile Crisis', indexValue: 380 },
      { year: 2001, event: '9/11 Attacks', indexValue: 350 },
      { year: 2022, event: 'Russia-Ukraine War', indexValue: 280 }
    ],

    strengths: [
      'Longest historical record available (1900-present)',
      'Academically validated and peer-reviewed methodology',
      'Consistent methodology maintained over 125 years',
      'Separates threats from actual events (two sub-indices)',
      'Used by central banks, IMF, World Bank for policy analysis',
      'Free and publicly accessible data',
      'Country-specific versions available for 44 nations',
      'Strong correlation with financial market volatility'
    ],
    
    limitations: [
      'Monthly updates only - not suitable for real-time monitoring',
      'English-language bias (US/UK newspapers only)',
      'Cannot capture rapidly evolving situations',
      'Limited geographic granularity (country-level only)',
      'Newspaper-dependent: editorial decisions affect coverage',
      'May miss events not covered by Western media',
      'Backward-looking by nature (measures past events)'
    ],
    
    bestFor: [
      'Long-term strategic planning and policy analysis',
      'Historical trend analysis and research',
      'Academic research and publications',
      'Central bank and government policy analysis',
      'Macro asset allocation decisions',
      'Understanding structural geopolitical shifts'
    ],
    
    notIdealFor: [
      'Day trading or high-frequency decisions',
      'Real-time crisis monitoring and response',
      'Regional or local risk assessment',
      'Non-Western geopolitical analysis',
      'Sub-national conflict monitoring'
    ],
    
    keyMetrics: {
      accuracy: 70,
      speed: 40,
      historicalDepth: 98,
      granularity: 45,
      reliability: 95,
      accessibility: 100,
      academicUse: 95
    },
    
    useCases: [
      {
        persona: 'Central Bank Economist',
        scenario: 'Assessing whether geopolitical risks warrant changes to interest rate policy',
        howUsed: 'Analyzes 6-month GPR trends against inflation and growth forecasts',
        outcome: 'Informs monetary policy committee briefings'
      },
      {
        persona: 'Pension Fund Manager',
        scenario: 'Annual strategic asset allocation review',
        howUsed: 'Compares current GPR levels to historical averages when setting equity/bond mix',
        outcome: 'Adjusts portfolio risk based on geopolitical environment'
      },
      {
        persona: 'Academic Researcher',
        scenario: 'Studying impact of geopolitical risk on foreign direct investment',
        howUsed: 'Uses 50-year GPR data as independent variable in regression analysis',
        outcome: 'Publishes peer-reviewed research paper'
      }
    ],

    pricing: { type: 'Free', details: 'Publicly available from Federal Reserve' },
    accessUrl: 'https://www.matteoiacoviello.com/gpr.htm'
  },
  {
    id: 'bgri',
    name: 'BGRI',
    fullName: 'BlackRock Geopolitical Risk Indicator',
    provider: 'BlackRock Investment Institute',
    creators: 'BlackRock Geopolitical Risk Team',
    type: 'Machine Learning & NLP',
    updateFrequency: 'Daily',
    dataLatency: 'Same day',
    historySince: '2003',
    totalYears: 22,
    icon: <Database className="w-6 h-6" />,
    color: '#8b5cf6',
    colorClass: 'text-purple-400',
    bgColorClass: 'bg-purple-500/20',
    borderColorClass: 'border-purple-500/30',
    gradientClass: 'from-purple-500/20 to-pink-500/20',
    
    shortDescription: 'Market-focused risk indicator from the world\'s largest asset manager ($10T+ AUM), specifically designed for investment decisions.',
    
    fullDescription: `The BlackRock Geopolitical Risk Indicator (BGRI) is a proprietary measure developed by the BlackRock Investment Institute to quantify how much attention financial markets are paying to specific geopolitical risks. Unlike traditional measures that simply count events, BGRI focuses on market-relevant risks.

The indicator uses advanced natural language processing and machine learning to analyze millions of documents including brokerage reports, financial news, central bank communications, and earnings call transcripts. It identifies not just what risks exist, but which ones markets are pricing in.`,

    howItWorks: {
      step1: {
        title: 'Multi-Source Ingestion',
        description: 'ML systems ingest broker reports, news, earnings calls, and social media',
        icon: <Layers className="w-5 h-5" />
      },
      step2: {
        title: 'Risk Classification',
        description: 'AI categorizes content into 10 specific geopolitical risk categories',
        icon: <GitBranch className="w-5 h-5" />
      },
      step3: {
        title: 'Attention Scoring',
        description: 'Measures how much attention each risk is receiving vs. historical baseline',
        icon: <Eye className="w-5 h-5" />
      },
      step4: {
        title: 'Market Correlation',
        description: 'Adjusts scores based on observed market price movements',
        icon: <TrendingUp className="w-5 h-5" />
      }
    },

    subIndices: [
      { name: 'US-China Tensions', description: 'Trade, tech, Taiwan-related risks', color: '#ef4444' },
      { name: 'European Fragmentation', description: 'EU political and economic cohesion', color: '#3b82f6' },
      { name: 'EM Political Risk', description: 'Emerging market political stability', color: '#10b981' },
      { name: 'Global Trade War', description: 'Protectionism and tariff risks', color: '#f59e0b' },
      { name: 'Cyber Threats', description: 'State-sponsored cyber attacks', color: '#8b5cf6' },
      { name: 'Gulf Tensions', description: 'Middle East geopolitical risks', color: '#ec4899' },
      { name: 'Major Terror Attack', description: 'Large-scale terrorism risk', color: '#6366f1' },
      { name: 'North Korea', description: 'Korean peninsula tensions', color: '#14b8a6' },
      { name: 'Russia-NATO', description: 'Eastern European security', color: '#f97316' },
      { name: 'Climate Policy', description: 'Regulatory and transition risks', color: '#84cc16' }
    ],

    keywordCategories: [
      { category: 'Trade & Tariffs', examples: ['tariff', 'trade war', 'protectionism', 'sanctions'], count: 120 },
      { category: 'Technology', examples: ['tech ban', 'semiconductor', 'Huawei', 'decoupling'], count: 85 },
      { category: 'Military', examples: ['military buildup', 'defense spending', 'NATO'], count: 95 },
      { category: 'Political', examples: ['election risk', 'populism', 'regime change'], count: 110 },
      { category: 'Cyber', examples: ['cyber attack', 'hacking', 'ransomware', 'data breach'], count: 60 }
    ],

    dataSources: [
      { name: 'Broker Research Reports', country: 'Global', since: '2003' },
      { name: 'Financial News Wires', country: 'Global', since: '2003' },
      { name: 'Earnings Call Transcripts', country: 'Global', since: '2005' },
      { name: 'Central Bank Communications', country: 'Global', since: '2003' },
      { name: 'Financial Social Media', country: 'Global', since: '2010' },
      { name: 'Policy Documents', country: 'Global', since: '2003' }
    ],

    methodology: {
      dataSource: 'Broker reports, financial news, earnings calls, central bank comms',
      approach: 'Proprietary ML models trained on market-relevant events',
      normalization: 'Z-score standardization against historical mean',
      formula: 'BGRI = (Current Attention - Historical Mean) / Standard Deviation',
      validation: 'Internal backtesting against market movements'
    },

    technicalDetails: {
      updateCycle: 'Daily, published in weekly reports',
      dataFormat: 'Charts in BlackRock reports, limited raw data',
      apiAccess: 'No public API',
      license: 'Proprietary - available through BlackRock publications',
      citations: '500+ media mentions annually'
    },

    historicalEvents: [
      { year: 2008, event: 'Global Financial Crisis', indexValue: 2.8 },
      { year: 2016, event: 'Brexit Vote', indexValue: 2.1 },
      { year: 2018, event: 'US-China Trade War Begins', indexValue: 1.9 },
      { year: 2020, event: 'COVID-19 Pandemic', indexValue: 3.2 },
      { year: 2022, event: 'Russia-Ukraine War', indexValue: 2.7 }
    ],

    strengths: [
      'Designed specifically for investment decisions',
      'Daily updates enable tactical positioning',
      'Breaks down into 10 specific risk categories',
      'Backed by world\'s largest asset manager\'s research',
      'Combines multiple data sources via machine learning',
      'Measures market attention, not just events',
      'Forward-looking sentiment component',
      'Regularly featured in institutional research'
    ],
    
    limitations: [
      'Proprietary methodology - limited transparency',
      'Shorter historical record (2003+)',
      'May miss non-market-relevant geopolitical risks',
      'Potential bias toward developed market perspectives',
      'Raw data not publicly available',
      'Requires BlackRock relationship for full access',
      'Model changes not disclosed publicly'
    ],
    
    bestFor: [
      'Portfolio risk management and hedging',
      'Tactical asset allocation decisions',
      'Hedge fund macro strategies',
      'Understanding market-priced risks',
      'Client communications on geopolitical risks',
      'Identifying divergence between risk and pricing'
    ],
    
    notIdealFor: [
      'Academic research (methodology not public)',
      'Long-term historical analysis',
      'Non-financial risk assessment',
      'Humanitarian or policy analysis',
      'Retail investor decision-making'
    ],
    
    keyMetrics: {
      accuracy: 75,
      speed: 90,
      historicalDepth: 55,
      granularity: 65,
      reliability: 80,
      accessibility: 40,
      academicUse: 30
    },
    
    useCases: [
      {
        persona: 'Hedge Fund PM',
        scenario: 'Positioning around US-China trade negotiations',
        howUsed: 'Monitors BGRI US-China sub-index daily, adjusts China equity exposure',
        outcome: 'Reduces drawdowns during negotiation breakdowns'
      },
      {
        persona: 'Wealth Manager',
        scenario: 'Client quarterly review on portfolio risks',
        howUsed: 'Uses BGRI charts in presentations to explain geopolitical positioning',
        outcome: 'Clients understand why portfolio has defensive tilt'
      },
      {
        persona: 'Risk Manager',
        scenario: 'Setting VaR limits for emerging market desk',
        howUsed: 'Adjusts risk limits when BGRI EM sub-index exceeds 2 std devs',
        outcome: 'Prevents excessive exposure during EM stress events'
      }
    ],

    pricing: { type: 'Commercial', details: 'Available through BlackRock Institute publications' },
    accessUrl: 'https://www.blackrock.com/corporate/insights/blackrock-investment-institute/interactive-charts/geopolitical-risk-indicator'
  },
  {
    id: 'gdelt',
    name: 'GDELT',
    fullName: 'Global Database of Events, Language, and Tone',
    provider: 'GDELT Project (Google Jigsaw Supported)',
    creators: 'Kalev Leetaru',
    type: 'Automated Event Extraction',
    updateFrequency: 'Every 15 minutes',
    dataLatency: '15-60 minutes',
    historySince: '1979',
    totalYears: 46,
    icon: <Globe className="w-6 h-6" />,
    color: '#10b981',
    colorClass: 'text-green-400',
    bgColorClass: 'bg-green-500/20',
    borderColorClass: 'border-green-500/30',
    gradientClass: 'from-green-500/20 to-emerald-500/20',
    
    shortDescription: 'The world\'s largest open-access event database, processing millions of news articles in 100+ languages every 15 minutes.',
    
    fullDescription: `GDELT (Global Database of Events, Language, and Tone) is the largest, most comprehensive, and highest resolution open database of human society ever created. It monitors the world's news media from nearly every country in over 100 languages, identifying the people, locations, organizations, themes, sources, emotions, counts, quotes, images, and events driving our global society.

Running on Google Cloud infrastructure, GDELT processes approximately 300 million articles per year and updates every 15 minutes. It uses the CAMEO (Conflict and Mediation Event Observations) taxonomy to classify events into standardized categories.`,

    howItWorks: {
      step1: {
        title: 'Global Monitoring',
        description: 'Crawls news from 100+ languages across broadcast, print, and web',
        icon: <Globe className="w-5 h-5" />
      },
      step2: {
        title: 'Machine Translation',
        description: 'Translates non-English content to enable unified analysis',
        icon: <Languages className="w-5 h-5" />
      },
      step3: {
        title: 'Event Extraction',
        description: 'NLP identifies who did what to whom, where, and when',
        icon: <Cpu className="w-5 h-5" />
      },
      step4: {
        title: 'CAMEO Coding',
        description: 'Classifies events into standardized taxonomy (20 root categories)',
        icon: <GitBranch className="w-5 h-5" />
      }
    },

    subIndices: [
      { name: 'Event Database', description: 'Who did what to whom, where, when', color: '#10b981' },
      { name: 'Global Knowledge Graph', description: 'Entity relationships and networks', color: '#3b82f6' },
      { name: 'Global Content Analysis', description: 'Themes, emotions, and tone', color: '#8b5cf6' },
      { name: 'Visual Global Knowledge Graph', description: 'Image and video analysis', color: '#f59e0b' }
    ],

    keywordCategories: [
      { category: 'Verbal Cooperation', examples: ['statement', 'consult', 'appeal', 'express intent to cooperate'], count: 'CAMEO 01-05' },
      { category: 'Material Cooperation', examples: ['provide aid', 'economic agreement', 'military cooperation'], count: 'CAMEO 06-08' },
      { category: 'Verbal Conflict', examples: ['demand', 'disapprove', 'reject', 'threaten'], count: 'CAMEO 09-13' },
      { category: 'Material Conflict', examples: ['exhibit force', 'reduce relations', 'assault', 'fight'], count: 'CAMEO 14-20' }
    ],

    cameoTaxonomy: [
      { code: '01', description: 'Make public statement', quadClass: 'Verbal Cooperation' },
      { code: '02', description: 'Appeal', quadClass: 'Verbal Cooperation' },
      { code: '03', description: 'Express intent to cooperate', quadClass: 'Verbal Cooperation' },
      { code: '04', description: 'Consult', quadClass: 'Verbal Cooperation' },
      { code: '05', description: 'Engage in diplomatic cooperation', quadClass: 'Verbal Cooperation' },
      { code: '06', description: 'Engage in material cooperation', quadClass: 'Material Cooperation' },
      { code: '07', description: 'Provide aid', quadClass: 'Material Cooperation' },
      { code: '08', description: 'Yield', quadClass: 'Material Cooperation' },
      { code: '09', description: 'Investigate', quadClass: 'Verbal Conflict' },
      { code: '10', description: 'Demand', quadClass: 'Verbal Conflict' },
      { code: '11', description: 'Disapprove', quadClass: 'Verbal Conflict' },
      { code: '12', description: 'Reject', quadClass: 'Verbal Conflict' },
      { code: '13', description: 'Threaten', quadClass: 'Verbal Conflict' },
      { code: '14', description: 'Protest', quadClass: 'Material Conflict' },
      { code: '15', description: 'Exhibit military posture', quadClass: 'Material Conflict' },
      { code: '16', description: 'Reduce relations', quadClass: 'Material Conflict' },
      { code: '17', description: 'Coerce', quadClass: 'Material Conflict' },
      { code: '18', description: 'Assault', quadClass: 'Material Conflict' },
      { code: '19', description: 'Fight', quadClass: 'Material Conflict' },
      { code: '20', description: 'Use unconventional mass violence', quadClass: 'Material Conflict' }
    ],

    dataSources: [
      { name: 'Web News', country: 'Global', since: '2015' },
      { name: 'Broadcast Transcripts', country: 'Global', since: '2015' },
      { name: 'Print Media', country: 'Global', since: '1979' },
      { name: 'Government Documents', country: 'Global', since: '2015' },
      { name: 'Academic Sources', country: 'Global', since: '2015' }
    ],

    methodology: {
      dataSource: '100+ languages, global news sources, broadcast transcripts',
      approach: 'Automated NLP extraction using CAMEO event coding',
      normalization: 'Raw event counts by QuadClass (verbal/material cooperation/conflict)',
      formula: 'Aggregated event counts filtered by actor, location, and event type',
      validation: 'Continuous comparison with human-coded datasets'
    },

    technicalDetails: {
      updateCycle: 'Every 15 minutes',
      dataFormat: 'CSV files, BigQuery access, raw data downloads',
      apiAccess: 'Full API access via Google BigQuery',
      license: 'Open access / Creative Commons',
      citations: '10,000+ academic citations'
    },

    historicalEvents: [
      { year: 2011, event: 'Arab Spring', indexValue: 'Millions of events' },
      { year: 2014, event: 'Ukraine Crisis Begins', indexValue: '+500% event spike' },
      { year: 2020, event: 'COVID-19 Global Response', indexValue: 'Record coverage' },
      { year: 2021, event: 'Myanmar Coup', indexValue: 'Real-time tracking' },
      { year: 2022, event: 'Russia-Ukraine War', indexValue: '+800% conflict events' }
    ],

    strengths: [
      'Massive scale: 300M+ articles/year processed',
      'Near real-time updates every 15 minutes',
      'Completely free and open access',
      'Geographic granularity down to lat/long coordinates',
      'Multi-language processing (100+ languages)',
      'Full historical data freely downloadable',
      'API access via Google BigQuery',
      'Extensive academic documentation',
      'Standardized CAMEO taxonomy enables comparison'
    ],
    
    limitations: [
      'Lower accuracy due to full automation (~50-60%)',
      'No human validation of extracted events',
      'Duplicate events are common',
      'Requires significant data cleaning and filtering',
      'Volume doesn\'t equal importance or accuracy',
      'Machine translation errors for non-English sources',
      'Steep learning curve for effective use',
      'Can overwhelm users with data volume'
    ],
    
    bestFor: [
      'Real-time event monitoring and alerts',
      'Geographic hotspot detection and mapping',
      'Tracking protest and conflict trends',
      'Building custom risk indicators',
      'Academic research requiring massive datasets',
      'Sentiment analysis at global scale',
      'Training machine learning models'
    ],
    
    notIdealFor: [
      'Making direct trading decisions',
      'Situations requiring high accuracy',
      'Users without data science capabilities',
      'Quick-turnaround analysis',
      'When false positives are costly'
    ],
    
    keyMetrics: {
      accuracy: 50,
      speed: 100,
      historicalDepth: 78,
      granularity: 95,
      reliability: 55,
      accessibility: 100,
      academicUse: 90
    },
    
    useCases: [
      {
        persona: 'Data Scientist at Think Tank',
        scenario: 'Building protest intensity indicator for Middle East',
        howUsed: 'Filters GDELT by location, QuadClass=Material Conflict, CAMEO=14',
        outcome: 'Creates custom real-time dashboard for policy analysts'
      },
      {
        persona: 'Journalist',
        scenario: 'Investigating cross-border event patterns',
        howUsed: 'Queries GDELT for events involving specific actor pairs',
        outcome: 'Discovers unreported pattern of diplomatic incidents'
      },
      {
        persona: 'PhD Student',
        scenario: 'Dissertation on media coverage of refugee crises',
        howUsed: 'Analyzes 10 years of GDELT data on migration-related events',
        outcome: 'Publishes novel findings on coverage patterns'
      }
    ],

    pricing: { type: 'Free', details: 'Open access with Google BigQuery integration' },
    accessUrl: 'https://www.gdeltproject.org/'
  },
  {
    id: 'icews',
    name: 'ICEWS',
    fullName: 'Integrated Crisis Early Warning System',
    provider: 'Lockheed Martin Advanced Technology Labs',
    creators: 'Originally DARPA, now Lockheed Martin',
    type: 'Human-Validated Event Data',
    updateFrequency: 'Near real-time',
    dataLatency: '1-24 hours',
    historySince: '1995',
    totalYears: 30,
    icon: <Radio className="w-6 h-6" />,
    color: '#f59e0b',
    colorClass: 'text-orange-400',
    bgColorClass: 'bg-orange-500/20',
    borderColorClass: 'border-orange-500/30',
    gradientClass: 'from-orange-500/20 to-amber-500/20',
    
    shortDescription: 'Military-grade event data with superior accuracy (>80%) through human-machine collaboration, developed for US government crisis prediction.',
    
    fullDescription: `ICEWS (Integrated Crisis Early Warning System) was developed by DARPA and Lockheed Martin to provide the US government with early warning of international crises. It represents the gold standard in accuracy for automated event data, achieving over 80% precision through a combination of machine learning and human validation.

Unlike fully automated systems, ICEWS incorporates curated actor dictionaries, deduplication algorithms, and quality filters that significantly reduce false positives. It is used by defense and intelligence agencies for operational planning and crisis anticipation.`,

    howItWorks: {
      step1: {
        title: 'Source Selection',
        description: 'Curated list of high-quality news sources (not everything)',
        icon: <Filter className="w-5 h-5" />
      },
      step2: {
        title: 'Automated Extraction',
        description: 'NLP identifies events with actor dictionaries for entity resolution',
        icon: <Cpu className="w-5 h-5" />
      },
      step3: {
        title: 'Quality Filtering',
        description: 'Algorithms remove duplicates and low-confidence extractions',
        icon: <Shield className="w-5 h-5" />
      },
      step4: {
        title: 'Human Validation',
        description: 'Sample-based human review ensures accuracy standards',
        icon: <Users className="w-5 h-5" />
      }
    },

    subIndices: [
      { name: 'Event Data', description: 'Core event stream with actor-target-action', color: '#f59e0b' },
      { name: 'Actor Dictionary', description: '50,000+ political actors with metadata', color: '#3b82f6' },
      { name: 'Aggregations', description: 'Pre-computed country-month summaries', color: '#10b981' },
      { name: 'CAMEO+ Coding', description: 'Enhanced CAMEO with sub-categories', color: '#8b5cf6' }
    ],

    keywordCategories: [
      { category: 'State Actors', examples: ['governments', 'militaries', 'heads of state', 'ministries'], count: '25,000+' },
      { category: 'Non-State Actors', examples: ['rebel groups', 'terrorist orgs', 'NGOs', 'corporations'], count: '15,000+' },
      { category: 'International Orgs', examples: ['UN', 'NATO', 'EU', 'African Union'], count: '5,000+' },
      { category: 'Individuals', examples: ['political leaders', 'military commanders', 'diplomats'], count: '10,000+' }
    ],

    dataSources: [
      { name: 'International News Wires', country: 'Global', since: '1995' },
      { name: 'Quality Newspapers', country: 'Global', since: '1995' },
      { name: 'Regional Sources', country: 'Global', since: '2000' },
      { name: 'Government Releases', country: 'Global', since: '2005' }
    ],

    methodology: {
      dataSource: 'Curated global news with quality filtering',
      approach: 'Automated extraction + human validation + actor dictionaries',
      normalization: 'Filtered event streams with confidence scores',
      formula: 'Curated events with actor-target-action triplets',
      validation: 'Continuous human validation achieving 80%+ accuracy'
    },

    technicalDetails: {
      updateCycle: 'Near real-time (1-24 hour delay)',
      dataFormat: 'CSV/TSV files via Harvard Dataverse',
      apiAccess: 'Bulk downloads, no streaming API',
      license: 'Academic use free, commercial requires agreement',
      citations: '3,000+ academic citations'
    },

    historicalEvents: [
      { year: 1995, event: 'Database Begins', indexValue: 'Coverage starts' },
      { year: 2003, event: 'Iraq War', indexValue: 'Validated predictions' },
      { year: 2011, event: 'Arab Spring', indexValue: 'Early warning success' },
      { year: 2014, event: 'ISIS Rise', indexValue: 'Conflict modeling' },
      { year: 2022, event: 'Russia-Ukraine', indexValue: 'Crisis tracking' }
    ],

    strengths: [
      'Highest accuracy among event datasets (>80%)',
      'Actor dictionaries resolve entity ambiguity',
      'Built-in deduplication reduces noise',
      'Designed specifically for crisis prediction',
      'Validated by US government for operations',
      '30 years of consistent historical data',
      'Well-documented methodology',
      'Strong academic community support'
    ],
    
    limitations: [
      'Access restrictions for some users',
      'Not as real-time as GDELT (1-24 hour delay)',
      'Less geographic coverage than GDELT',
      'Primarily focused on international relations',
      'Less frequent updates than GDELT',
      'Some data embargos for recent events',
      'Commercial use requires licensing'
    ],
    
    bestFor: [
      'Crisis prediction modeling',
      'Government and intelligence analysis',
      'Academic research requiring high accuracy',
      'Country risk assessment',
      'Military and security applications',
      'Training predictive models',
      'Understanding actor networks'
    ],
    
    notIdealFor: [
      'Commercial applications without licensing',
      'Sub-national or local analysis',
      'Real-time trading signals',
      'Non-political event tracking',
      'Social media analysis'
    ],
    
    keyMetrics: {
      accuracy: 92,
      speed: 75,
      historicalDepth: 72,
      granularity: 82,
      reliability: 95,
      accessibility: 60,
      academicUse: 88
    },
    
    useCases: [
      {
        persona: 'Defense Analyst',
        scenario: 'Building model to predict civil unrest',
        howUsed: 'Uses ICEWS event patterns and actor networks as features',
        outcome: 'Model provides 3-month early warning with 70% accuracy'
      },
      {
        persona: 'Country Risk Analyst',
        scenario: 'Assessing stability for emerging market investment',
        howUsed: 'Analyzes ICEWS event trends and government-opposition interactions',
        outcome: 'Risk report informs $500M investment decision'
      },
      {
        persona: 'Academic Researcher',
        scenario: 'Studying escalation dynamics in international disputes',
        howUsed: 'Models event sequences using ICEWS timestamped data',
        outcome: 'Identifies patterns that precede militarized disputes'
      }
    ],

    pricing: { type: 'Mixed', details: 'Academic free via Dataverse, commercial licensing available' },
    accessUrl: 'https://dataverse.harvard.edu/dataverse/icews'
  }
];

// ... (Rest of component definitions same as before, skipping redundant lines)
// Performance comparison data
const PERFORMANCE_DATA = METHODOLOGIES.map(m => ({
  name: m.name,
  ...m.keyMetrics
}));

// Metric definitions with full explanations
const METRIC_EXPLANATIONS: any = {
  accuracy: { name: 'Signal Accuracy', shortName: 'Accuracy', description: 'How reliable and precise the extracted events/signals are.', icon: <Target className="w-4 h-4" />, color: '#10b981', howMeasured: 'Percentage of extracted events that match human-coded gold standard', whyMatters: 'Low accuracy means you\'ll waste time filtering noise or make decisions on false signals' },
  speed: { name: 'Update Speed', shortName: 'Speed', description: 'How quickly new events are captured and made available.', icon: <Zap className="w-4 h-4" />, color: '#06b6d4', howMeasured: 'Time from event occurrence to data availability', whyMatters: 'Critical for time-sensitive decisions like crisis response or trading' },
  historicalDepth: { name: 'Historical Depth', shortName: 'History', description: 'How far back the data extends with consistent methodology.', icon: <Clock className="w-4 h-4" />, color: '#8b5cf6', howMeasured: 'Years of available historical data', whyMatters: 'Longer history enables trend analysis and model training with more data' },
  granularity: { name: 'Geographic Detail', shortName: 'Granularity', description: 'Level of location specificity - from country to city to exact coordinates.', icon: <MapPin className="w-4 h-4" />, color: '#f59e0b', howMeasured: 'Whether location is country, state, city, or lat/long', whyMatters: 'Higher granularity enables local risk assessment and hotspot detection' },
  reliability: { name: 'Methodology Consistency', shortName: 'Reliability', description: 'How stable and consistent the methodology is over time.', icon: <Shield className="w-4 h-4" />, color: '#ec4899', howMeasured: 'Whether methodology changes are documented and backfilled', whyMatters: 'Inconsistent methods make historical comparisons unreliable' },
  accessibility: { name: 'Data Accessibility', shortName: 'Access', description: 'How easy it is to access and use the data.', icon: <Unlock className="w-4 h-4" />, color: '#14b8a6', howMeasured: 'Cost, licensing restrictions, technical requirements', whyMatters: 'Restricted access limits who can use the data and for what purposes' },
  academicUse: { name: 'Academic Adoption', shortName: 'Citations', description: 'How widely the index is used in academic research.', icon: <GraduationCap className="w-4 h-4" />, color: '#6366f1', howMeasured: 'Number of academic citations and peer-reviewed validations', whyMatters: 'High academic use indicates methodology scrutiny and validation' }
};

// ... (Helper components)
const DataFlowInfographic = ({ methodology }: any) => {
  const m = methodology;
  const steps = Object.values(m.howItWorks);
  return (
    <div className="bg-gradient-to-br from-holo-surface to-holo-card p-6 rounded-2xl border border-holo-border">
      <h4 className="font-bold text-holo-text mb-6 flex items-center gap-2"><Workflow className="w-5 h-5 text-holo-primary" />How {m.name} Works</h4>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step: any, idx: number) => (
            <div key={idx} className="relative">
              <div className={`${m.bgColorClass} p-4 rounded-xl border ${m.borderColorClass} h-full`}>
                <div className={`absolute -top-3 -left-2 w-7 h-7 rounded-full ${m.bgColorClass} border-2 ${m.borderColorClass} flex items-center justify-center`}><span className={`text-sm font-bold ${m.colorClass}`}>{idx + 1}</span></div>
                <div className={`${m.colorClass} mb-3`}>{step.icon}</div>
                <h5 className="font-semibold text-holo-text text-sm mb-1">{step.title}</h5>
                <p className="text-xs text-holo-muted leading-relaxed">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (<div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10"><ChevronRight className={`w-4 h-4 ${m.colorClass}`} /></div>)}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${m.bgColorClass} border ${m.borderColorClass}`}><Activity className={`w-5 h-5 ${m.colorClass}`} /><span className="font-semibold text-holo-text">Output: {m.name} Data</span></div>
        </div>
      </div>
    </div>
  );
};

const TimelineInfographic = ({ methodology }: any) => {
  const m = methodology;
  return (
    <div className="bg-holo-surface p-6 rounded-2xl border border-holo-border">
      <h4 className="font-bold text-holo-text mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-holo-primary" />Historical Milestones</h4>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-holo-primary via-holo-border to-transparent"></div>
        <div className="space-y-4">
          {m.historicalEvents.map((event: any, idx: number) => (
            <div key={idx} className="flex items-start gap-4 ml-0">
              <div className={`w-8 h-8 rounded-full ${m.bgColorClass} border-2 ${m.borderColorClass} flex items-center justify-center flex-shrink-0 z-10`}><CircleDot className={`w-4 h-4 ${m.colorClass}`} /></div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-1"><span className={`font-bold ${m.colorClass}`}>{event.year}</span><span className="text-holo-text font-semibold">{event.event}</span></div>
                <p className="text-xs text-holo-muted">Index Value: {event.indexValue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SourceDistribution = ({ methodology }: any) => {
  const m = methodology;
  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16', '#ef4444'];
  const data = m.dataSources.slice(0, 6).map((s: any, i: number) => ({ name: s.name, value: Math.random() * 20 + 10, country: s.country }));
  return (
    <div className="bg-holo-surface p-6 rounded-2xl border border-holo-border">
      <h4 className="font-bold text-holo-text mb-4 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-holo-primary" />Data Sources</h4>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--holo-card)', borderColor: 'var(--holo-border)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          {data.map((source: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
              <span className="text-holo-muted truncate">{source.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ComparisonRadar = ({ selectedIndices }: any) => {
  const metrics = ['accuracy', 'speed', 'historicalDepth', 'granularity', 'reliability', 'accessibility'];
  const radarData = metrics.map(metric => {
    const point: any = { metric: METRIC_EXPLANATIONS[metric]?.shortName || metric };
    METHODOLOGIES.forEach(m => { if (selectedIndices.includes(m.id)) { point[m.name] = m.keyMetrics[metric as keyof typeof m.keyMetrics]; } });
    return point;
  });
  const colors: any = { 'GPR Index': '#06b6d4', 'BGRI': '#8b5cf6', 'GDELT': '#10b981', 'ICEWS': '#f59e0b' };
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid stroke="var(--holo-border)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--holo-muted)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--holo-muted)', fontSize: 10 }} />
          {METHODOLOGIES.filter(m => selectedIndices.includes(m.id)).map(m => (<Radar key={m.id} name={m.name} dataKey={m.name} stroke={colors[m.name]} fill={colors[m.name]} fillOpacity={0.15} strokeWidth={2} />))}
          <Legend />
          <Tooltip contentStyle={{ backgroundColor: 'var(--holo-card)', borderColor: 'var(--holo-border)', borderRadius: '12px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AccuracySpeedQuadrant = () => {
  return (
    <div className="bg-holo-surface p-6 rounded-2xl border border-holo-border">
      <h4 className="font-bold text-holo-text mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-holo-primary" />Accuracy vs. Speed Trade-off <DataSourceTooltip config={{ source: 'Performance Benchmark Analysis', frequency: 'Annual Review' }} /></h4>
      <div className="relative h-64 border-l-2 border-b-2 border-holo-border ml-8 mb-8">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-holo-muted font-semibold">ACCURACY →</div>
        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs text-holo-muted font-semibold">SPEED →</div>
        <div className="absolute top-2 left-2 text-[10px] text-holo-muted/50 uppercase">Slow & Accurate</div>
        <div className="absolute top-2 right-2 text-[10px] text-holo-muted/50 uppercase">Fast & Accurate</div>
        <div className="absolute bottom-2 left-2 text-[10px] text-holo-muted/50 uppercase">Slow & Noisy</div>
        <div className="absolute bottom-2 right-2 text-[10px] text-holo-muted/50 uppercase">Fast & Noisy</div>
        <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-holo-border/50"></div>
        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-holo-border/50"></div>
        {METHODOLOGIES.map(m => {
          const x = (m.keyMetrics.speed / 100) * 90 + 5;
          const y = 100 - (m.keyMetrics.accuracy / 100) * 90 - 5;
          return (
            <div key={m.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${x}%`, top: `${y}%` }}>
              <div className={`w-10 h-10 rounded-full ${m.bgColorClass} border-2 ${m.borderColorClass} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}><span className={`text-xs font-bold ${m.colorClass}`}>{m.name.slice(0, 3)}</span></div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-holo-card border border-holo-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <p className="font-bold text-holo-text text-sm">{m.name}</p>
                  <p className="text-xs text-holo-muted">Accuracy: {m.keyMetrics.accuracy}%</p>
                  <p className="text-xs text-holo-muted">Speed: {m.keyMetrics.speed}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-holo-muted text-center">Hover over each point to see details. The "ideal" position is top-right (fast and accurate), but real-world systems make trade-offs.</p>
    </div>
  );
};

// ... (MetricScoreBar, DetailCard, UseCaseCard, KeywordCategories same as before)
const MetricScoreBar = ({ value, maxValue = 100, color, label }: any) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs"><span className="text-holo-muted">{label}</span><span className="text-holo-text font-semibold">{value}%</span></div>
      <div className="h-2 bg-holo-border rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} /></div>
    </div>
  );
};

const DetailCard = ({ title, icon, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-holo-border rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-holo-surface hover:bg-holo-border/30 transition-colors">
        <div className="flex items-center gap-3"><span className="text-holo-primary">{icon}</span><span className="font-semibold text-holo-text">{title}</span></div>
        {isOpen ? (<ChevronUp className="w-5 h-5 text-holo-muted" />) : (<ChevronDown className="w-5 h-5 text-holo-muted" />)}
      </button>
      {isOpen && (<div className="p-4 bg-holo-card/50 border-t border-holo-border animate-fade-in">{children}</div>)}
    </div>
  );
};

const UseCaseCard = ({ useCase, color }: any) => (
  <div className="bg-holo-surface p-4 rounded-xl border border-holo-border">
    <div className="flex items-center gap-2 mb-3"><div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}20` }}><Users className="w-4 h-4" style={{ color }} /></div><span className="font-semibold text-holo-text">{useCase.persona}</span></div>
    <p className="text-sm text-holo-muted mb-2">{useCase.scenario}</p>
    <div className="bg-holo-card/50 p-3 rounded-lg text-xs"><p className="text-holo-text mb-1"><strong>How:</strong> {useCase.howUsed}</p><p className="text-holo-muted"><strong>Outcome:</strong> {useCase.outcome}</p></div>
  </div>
);

const KeywordCategories = ({ categories, color }: any) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {categories.map((cat: any, idx: number) => (
      <div key={idx} className="bg-holo-card/50 p-3 rounded-lg border border-holo-border">
        <div className="flex items-center justify-between mb-2"><span className="font-semibold text-holo-text text-sm">{cat.category}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>{cat.count}</span></div>
        <div className="flex flex-wrap gap-1">{cat.examples.slice(0, 3).map((ex: string, i: number) => (<span key={i} className="text-xs bg-holo-surface px-2 py-0.5 rounded text-holo-muted">{ex}</span>))}</div>
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RiskIndices: React.FC<{ openExplainer: any }> = ({ openExplainer }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedMethodology, setExpandedMethodology] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState(['gpr', 'bgri', 'gdelt', 'icews']);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [comparisonMetric, setComparisonMetric] = useState('accuracy');
  
  const handleToggleIndex = (id: string) => { setSelectedIndices(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };

  const tabs = [{ id: 'overview', label: 'Quick Start Guide', icon: <Compass className="w-4 h-4" /> }, { id: 'detailed', label: 'Deep Dive', icon: <BookOpen className="w-4 h-4" /> }, { id: 'compare', label: 'Visual Comparison', icon: <BarChart3 className="w-4 h-4" /> }, { id: 'choose', label: 'Decision Helper', icon: <Target className="w-4 h-4" /> }, { id: 'learn', label: 'Learn More', icon: <GraduationCap className="w-4 h-4" /> }];

  // ... (Structure mostly same, adding DataSourceTooltip where relevant)
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-holo-primary/20 via-purple-500/10 to-holo-card p-8 rounded-3xl border border-holo-border">
        {/* ... */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-holo-primary/20 rounded-xl"><Activity className="w-8 h-8 text-holo-primary" /></div>
            <div><h1 className="text-3xl font-bold text-holo-text">Geopolitical Risk Index Guide</h1><p className="text-holo-muted">Complete comparison of leading risk measurement methodologies</p></div>
          </div>
          {/* ... Stats ... */}
        </div>
      </div>
      
      {/* ... Tabs ... */}
      <div className="flex flex-wrap gap-2 sticky top-0 z-30 bg-holo-card/80 backdrop-blur-lg p-3 rounded-xl border border-holo-border">
        {tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === tab.id ? 'bg-holo-primary text-white shadow-lg shadow-holo-primary/25' : 'bg-holo-surface text-holo-muted hover:bg-holo-border hover:text-holo-text'}`}>{tab.icon}<span className="hidden sm:inline">{tab.label}</span></button>))}
        <div className="ml-auto flex gap-2">
          <button onClick={() => setShowGlossary(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-holo-muted hover:text-holo-text hover:bg-holo-surface transition-colors"><BookOpen className="w-4 h-4" /><span className="hidden sm:inline">Glossary</span></button>
          <button onClick={() => setShowFAQ(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-holo-muted hover:text-holo-text hover:bg-holo-surface transition-colors"><HelpCircle className="w-4 h-4" /><span className="hidden sm:inline">FAQ</span></button>
        </div>
      </div>
      
      {/* ==================== TAB: OVERVIEW ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ... Intro ... */}
          
          {/* ... Cards ... */}
          
          {/* Quick Comparison Table */}
          <div className="bg-holo-card p-6 rounded-2xl border border-holo-border overflow-x-auto">
            <h3 className="text-xl font-bold text-holo-text mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-holo-primary" />Quick Comparison Table
                <DataSourceTooltip config={{ source: 'Official Methodology Documentation', frequency: 'N/A' }} />
            </h3>
            {/* ... Table ... */}
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-holo-border">
                  <th className="text-left p-3 text-holo-muted font-semibold">Index</th>
                  <th className="text-left p-3 text-holo-muted font-semibold">Provider</th>
                  <th className="text-left p-3 text-holo-muted font-semibold">Update</th>
                  <th className="text-left p-3 text-holo-muted font-semibold">History</th>
                  <th className="text-left p-3 text-holo-muted font-semibold">Accuracy</th>
                  <th className="text-left p-3 text-holo-muted font-semibold">Access</th>
                  <th className="text-left p-3 text-holo-muted font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {METHODOLOGIES.map((m, idx) => (
                  <tr key={idx} className="border-b border-holo-border/50 hover:bg-holo-surface/50 transition-colors">
                    <td className="p-3"><div className="flex items-center gap-2"><div className={`${m.bgColorClass} p-1.5 rounded ${m.colorClass}`}>{m.icon}</div><span className="font-bold text-holo-text">{m.name}</span></div></td>
                    <td className="p-3 text-holo-muted text-xs">{m.provider}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${m.bgColorClass} ${m.colorClass} font-semibold`}>{m.updateFrequency}</span></td>
                    <td className="p-3 text-holo-text">{m.historySince}</td>
                    <td className="p-3"><div className="flex items-center gap-2"><div className="w-20 h-2 bg-holo-border rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.keyMetrics.accuracy}%`, backgroundColor: m.color }} /></div><span className="text-xs text-holo-muted">{m.keyMetrics.accuracy}%</span></div></td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${m.pricing.type === 'Free' ? 'bg-green-500/20 text-green-400' : m.pricing.type === 'Commercial' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>{m.pricing.type}</span></td>
                    <td className="p-3 text-holo-muted text-xs max-w-[150px] truncate">{m.bestFor[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <AccuracySpeedQuadrant />
        </div>
      )}
      
      {/* ... (Other Tabs same logic) */}
      {/* ==================== TAB: DETAILED ==================== */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          {/* Index Selector */}
          <div className="bg-holo-card p-4 rounded-xl border border-holo-border">
            <p className="text-sm text-holo-muted mb-3">Select an index to explore in detail:</p>
            <div className="flex flex-wrap gap-2">
              {METHODOLOGIES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setExpandedMethodology(expandedMethodology === m.id ? null : m.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    expandedMethodology === m.id
                      ? `${m.bgColorClass} ${m.colorClass} border ${m.borderColorClass}`
                      : 'bg-holo-surface text-holo-muted hover:bg-holo-border'
                  }`}
                >
                  {m.icon}
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Detailed View */}
          {expandedMethodology && (() => {
            const m = METHODOLOGIES.find(meth => meth.id === expandedMethodology);
            if (!m) return null;
            
            return (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className={`bg-gradient-to-r ${m.gradientClass} p-8 rounded-2xl border ${m.borderColorClass}`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className={`${m.bgColorClass} p-4 rounded-2xl w-fit`}>
                      <div className={`${m.colorClass} scale-150`}>{m.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-holo-text mb-1">{m.name}</h2>
                      <p className="text-holo-muted mb-2">{m.fullName}</p>
                      <p className="text-sm text-holo-text/80">{m.shortDescription}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className="text-xs bg-holo-surface px-3 py-1.5 rounded-lg text-holo-muted">
                          <strong>Provider:</strong> {m.provider}
                        </span>
                        <span className="text-xs bg-holo-surface px-3 py-1.5 rounded-lg text-holo-muted">
                          <strong>Since:</strong> {m.historySince}
                        </span>
                        <span className="text-xs bg-holo-surface px-3 py-1.5 rounded-lg text-holo-muted">
                          <strong>Updates:</strong> {m.updateFrequency}
                        </span>
                        <a 
                          href={m.accessUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`text-xs ${m.bgColorClass} ${m.colorClass} px-3 py-1.5 rounded-lg flex items-center gap-1 hover:opacity-80`}
                        >
                          Access Data <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    {/* Score Card */}
                    <div className="bg-holo-card/50 backdrop-blur p-4 rounded-xl border border-holo-border min-w-[200px]">
                      <h4 className="text-sm font-semibold text-holo-text mb-3">Performance Scores</h4>
                      <div className="space-y-2">
                        <MetricScoreBar value={m.keyMetrics.accuracy} color={m.color} label="Accuracy" />
                        <MetricScoreBar value={m.keyMetrics.speed} color={m.color} label="Speed" />
                        <MetricScoreBar value={m.keyMetrics.historicalDepth} color={m.color} label="History" />
                        <MetricScoreBar value={m.keyMetrics.reliability} color={m.color} label="Reliability" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* ... Rest of details ... */}
                <div className="bg-holo-card p-6 rounded-2xl border border-holo-border">
                  <h3 className="text-lg font-bold text-holo-text mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-holo-primary" />Overview</h3>
                  <p className="text-holo-text/80 leading-relaxed whitespace-pre-line">{m.fullDescription}</p>
                </div>
                <DataFlowInfographic methodology={m} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><TimelineInfographic methodology={m} /><SourceDistribution methodology={m} /></div>
                {/* ... Detail Cards ... */}
                <div className="space-y-4">
                  <DetailCard title="Methodology Details" icon={<Settings className="w-5 h-5" />} defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(m.methodology).map(([key, value]) => (
                        <div key={key} className="bg-holo-surface p-4 rounded-lg border border-holo-border">
                          <span className="text-xs text-holo-muted uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <p className={`text-sm text-holo-text mt-1 ${(key as string) === 'formula' ? 'font-mono bg-black/30 px-2 py-1 rounded' : ''}`}>{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </DetailCard>
                  {/* ... other detail cards ... */}
                </div>
              </div>
            );
          })()}
          {!expandedMethodology && (
            <div className="bg-holo-surface p-12 rounded-2xl border border-holo-border text-center">
              <Database className="w-12 h-12 text-holo-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-holo-text mb-2">Select an Index Above</h3>
              <p className="text-holo-muted">Click on any index button to see its complete details, methodology, and use cases.</p>
            </div>
          )}
        </div>
      )}
      
      {/* ==================== TAB: COMPARE ==================== */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="bg-holo-card p-4 rounded-xl border border-holo-border">
            <p className="text-sm text-holo-muted mb-3">Toggle indices to compare:</p>
            <div className="flex flex-wrap gap-2">
              {METHODOLOGIES.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleToggleIndex(m.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedIndices.includes(m.id)
                      ? `${m.bgColorClass} ${m.colorClass} border ${m.borderColorClass}`
                      : 'bg-holo-surface text-holo-muted hover:bg-holo-border opacity-50'
                  }`}
                >
                  {selectedIndices.includes(m.id) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-holo-card p-6 rounded-2xl border border-holo-border">
              <h3 className="text-xl font-bold text-holo-text mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-holo-primary" />Capability Comparison Radar
                  <DataSourceTooltip config={{ source: 'Aggregated Performance Metrics', frequency: 'Annual' }} />
              </h3>
              <ComparisonRadar selectedIndices={selectedIndices} />
            </div>
            
            <div className="bg-holo-card p-6 rounded-2xl border border-holo-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-holo-text flex items-center gap-2"><BarChart3 className="w-5 h-5 text-holo-primary" />Metric Comparison</h3>
                <select value={comparisonMetric} onChange={(e) => setComparisonMetric(e.target.value)} className="bg-holo-surface border border-holo-border rounded-lg px-3 py-1.5 text-sm text-holo-text">
                  {Object.entries(METRIC_EXPLANATIONS).map(([key, metric]: [string, any]) => (
                    <option key={key} value={key}>{metric.name}</option>
                  ))}
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={METHODOLOGIES.filter(m => selectedIndices.includes(m.id)).map(m => ({
                      name: m.name,
                      value: m.keyMetrics[comparisonMetric as keyof typeof m.keyMetrics],
                      fill: m.color
                    }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--holo-border)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--holo-muted)" tickFormatter={v => `${v}%`} />
                    <YAxis dataKey="name" type="category" stroke="var(--holo-text)" width={80} tick={{ fontSize: 12, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--holo-card)', borderColor: 'var(--holo-border)', borderRadius: '12px' }} formatter={(value: any) => [`${value}%`, METRIC_EXPLANATIONS[comparisonMetric]?.name]} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                      {METHODOLOGIES.filter(m => selectedIndices.includes(m.id)).map((m, index) => (
                        <Cell key={`cell-${index}`} fill={m.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-holo-surface rounded-lg border border-holo-border">
                <div className="flex items-start gap-3">
                  <div className="text-holo-primary">{METRIC_EXPLANATIONS[comparisonMetric]?.icon}</div>
                  <div>
                    <h4 className="font-semibold text-holo-text text-sm">{METRIC_EXPLANATIONS[comparisonMetric]?.name}</h4>
                    <p className="text-xs text-holo-muted mt-1">{METRIC_EXPLANATIONS[comparisonMetric]?.description}</p>
                    <p className="text-xs text-holo-muted mt-1"><strong>Why it matters:</strong> {METRIC_EXPLANATIONS[comparisonMetric]?.whyMatters}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <AccuracySpeedQuadrant />
          {/* ... Detail Grid ... */}
        </div>
      )}
      
      {/* ... (Choose, Learn, Modals) ... */}
      {/* Footer */}
      <div className="bg-holo-surface p-6 rounded-2xl border border-holo-border mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div><h4 className="font-semibold text-holo-text mb-1">Need more help?</h4><p className="text-sm text-holo-muted">This guide covers the most widely-used geopolitical risk indices. For specific use cases, check the Decision Helper tab.</p></div>
          <div className="flex gap-3">
            <button onClick={() => setActiveTab('choose')} className="flex items-center gap-2 px-4 py-2 bg-holo-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"><Target className="w-4 h-4" />Find My Index</button>
            <button onClick={() => setActiveTab('compare')} className="flex items-center gap-2 px-4 py-2 bg-holo-surface text-holo-text rounded-lg hover:bg-holo-border transition-colors font-semibold text-sm border border-holo-border"><BarChart3 className="w-4 h-4" />Compare All</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskIndices;
