export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  modules: number;
  imageUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const courses: Course[] = [
  {
    id: 'iota-basics',
    title: 'IOTA Fundamentals',
    description: 'Learn the basics of IOTA blockchain, its unique tangle architecture, and how it enables feeless transactions for IoT.',
    category: 'Blockchain',
    duration: '2 hours',
    modules: 4,
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
    level: 'Beginner'
  },
  {
    id: 'move-programming',
    title: 'Move Smart Contracts',
    description: 'Master the Move programming language for building secure and efficient smart contracts on IOTA.',
    category: 'Development',
    duration: '4 hours',
    modules: 4,
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    level: 'Intermediate'
  },
  {
    id: 'defi-iota',
    title: 'DeFi on IOTA',
    description: 'Explore decentralized finance applications and protocols built on the IOTA ecosystem.',
    category: 'DeFi',
    duration: '3 hours',
    modules: 4,
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    level: 'Advanced'
  },
  {
    id: 'nft-creation',
    title: 'NFT Development',
    description: 'Create and deploy NFTs on IOTA blockchain using Move. Learn about digital asset standards and metadata.',
    category: 'NFT',
    duration: '2.5 hours',
    modules: 4,
    imageUrl: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=300&fit=crop',
    level: 'Intermediate'
  },
  {
    id: 'dapp-development',
    title: 'Full-Stack dApp',
    description: 'Build a complete decentralized application from scratch using React, TypeScript, and IOTA SDK.',
    category: 'Development',
    duration: '5 hours',
    modules: 4,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    level: 'Advanced'
  },
  {
    id: 'iot-integration',
    title: 'IoT & IOTA',
    description: 'Connect Internet of Things devices to IOTA network for secure, feeless machine-to-machine transactions.',
    category: 'IoT',
    duration: '3 hours',
    modules: 4,
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop',
    level: 'Intermediate'
  }
];

export interface ModuleInfo {
  id: number;
  title: string;
  description: string;
}

export const getModulesForCourse = (courseId: string): ModuleInfo[] => {
  const moduleTemplates: Record<string, ModuleInfo[]> = {
    'iota-basics': [
      { id: 1, title: 'Introduction to IOTA', description: 'Understanding the Tangle and DAG architecture' },
      { id: 2, title: 'IOTA Tokens & Wallets', description: 'Managing IOTA tokens and wallet setup' },
      { id: 3, title: 'Network Fundamentals', description: 'Nodes, validators, and consensus' },
      { id: 4, title: 'Use Cases & Applications', description: 'Real-world IOTA implementations' }
    ],
    'move-programming': [
      { id: 1, title: 'Move Language Basics', description: 'Syntax, types, and module structure' },
      { id: 2, title: 'Resources & Abilities', description: 'Understanding Move\'s resource model' },
      { id: 3, title: 'Writing Smart Contracts', description: 'Creating your first Move module' },
      { id: 4, title: 'Testing & Deployment', description: 'Testing and deploying on IOTA testnet' }
    ],
    'defi-iota': [
      { id: 1, title: 'DeFi Fundamentals', description: 'Core concepts of decentralized finance' },
      { id: 2, title: 'Liquidity & AMMs', description: 'Automated market makers and pools' },
      { id: 3, title: 'Lending Protocols', description: 'Borrowing and lending on IOTA' },
      { id: 4, title: 'Yield Strategies', description: 'Advanced DeFi strategies and risks' }
    ],
    'nft-creation': [
      { id: 1, title: 'NFT Concepts', description: 'Digital ownership and standards' },
      { id: 2, title: 'Creating NFTs in Move', description: 'Writing NFT smart contracts' },
      { id: 3, title: 'Metadata & Storage', description: 'Off-chain data and IPFS integration' },
      { id: 4, title: 'Marketplaces', description: 'Building NFT trading functionality' }
    ],
    'dapp-development': [
      { id: 1, title: 'Project Setup', description: 'React, TypeScript, and IOTA SDK setup' },
      { id: 2, title: 'Wallet Integration', description: 'Connecting wallets with dApp Kit' },
      { id: 3, title: 'Smart Contract Integration', description: 'Calling Move functions from frontend' },
      { id: 4, title: 'Deployment & Testing', description: 'Deploying your complete dApp' }
    ],
    'iot-integration': [
      { id: 1, title: 'IoT Fundamentals', description: 'Sensors, devices, and protocols' },
      { id: 2, title: 'IOTA Streams', description: 'Secure data channels for IoT' },
      { id: 3, title: 'Machine Economy', description: 'M2M payments and automation' },
      { id: 4, title: 'Building IoT Solutions', description: 'End-to-end IoT project' }
    ]
  };

  return moduleTemplates[courseId] || [
    { id: 1, title: 'Module 1', description: 'Introduction and basics' },
    { id: 2, title: 'Module 2', description: 'Core concepts' },
    { id: 3, title: 'Module 3', description: 'Advanced topics' },
    { id: 4, title: 'Module 4', description: 'Project and assessment' }
  ];
};
