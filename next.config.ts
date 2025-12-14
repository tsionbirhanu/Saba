import type { NextConfig } from "next";
import type webpack from 'webpack'; 

const nextConfig: NextConfig = {
 

  webpack: (config: webpack.Configuration, { isServer, defaultLoaders }) => {
    
    if (isServer) {
        
        config.target = 'node'; 
        
        config.externals = [
            ...(config.externals || []),
            "@emurgo/cardano-serialization-lib-nodejs" 
        ];
    }
    
    return config;
  },
};

export default nextConfig;