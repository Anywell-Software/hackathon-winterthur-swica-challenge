// ============================================
// Dexie Database Schema
// ============================================

import Dexie, { Table } from 'dexie';
import { User, UserTaskInstance, UserAchievement, DailyStats } from '../../types';

export class VorsorgeGuideDB extends Dexie {
  users!: Table<User, string>;
  taskInstances!: Table<UserTaskInstance, string>;
  achievements!: Table<UserAchievement, string>;
  dailyStats!: Table<DailyStats, string>;

  constructor() {
    super('VorsorgeGuideDB');
    
    this.version(1).stores({
      users: 'id, name, age, gender',
      taskInstances: 'id, oderId, taskId, status, nextDue',
      achievements: 'id, oderId, achievementId, unlockedAt',
      dailyStats: 'date, oderId',
    });
  }
}

export const db = new VorsorgeGuideDB();

// Database utilities
export const clearDatabase = async () => {
  await db.users.clear();
  await db.taskInstances.clear();
  await db.achievements.clear();
  await db.dailyStats.clear();
};

export const exportDatabase = async () => {
  const users = await db.users.toArray();
  const taskInstances = await db.taskInstances.toArray();
  const achievements = await db.achievements.toArray();
  const dailyStats = await db.dailyStats.toArray();
  
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      users,
      taskInstances,
      achievements,
      dailyStats,
    },
  };
};

export const importDatabase = async (data: ReturnType<typeof exportDatabase> extends Promise<infer T> ? T : never) => {
  await clearDatabase();
  
  if (data.data.users.length) await db.users.bulkAdd(data.data.users);
  if (data.data.taskInstances.length) await db.taskInstances.bulkAdd(data.data.taskInstances);
  if (data.data.achievements.length) await db.achievements.bulkAdd(data.data.achievements);
  if (data.data.dailyStats.length) await db.dailyStats.bulkAdd(data.data.dailyStats);
};

export default db;
