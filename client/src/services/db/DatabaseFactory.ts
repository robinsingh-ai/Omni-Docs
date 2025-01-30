import { SupabaseService } from './SupabaseService';
import { DatabaseService } from './DatabaseInterface';

export const databaseFactory: DatabaseService = SupabaseService;
