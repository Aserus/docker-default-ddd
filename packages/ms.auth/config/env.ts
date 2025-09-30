import dotenv from 'dotenv';

dotenv.config();



export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtAccessTtl: process.env.JWT_ACCESS_TTL || '15m',
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL || '30d',
  databaseUrl: process.env.DATABASE_URL || '',
};


Object.entries(env).forEach(([key, value])=>{
  if(!value || value===''){
    console.error(`[env] ${key} is not set`);
    process.exit(1)
  }
})
