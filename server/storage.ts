import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, desc, asc } from "drizzle-orm";
import {
  users,
  projects,
  tasks,
  timeEntries,
  projectMembers,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type TimeEntry,
  type InsertTimeEntry,
  type ProjectMember,
  type InsertProjectMember,
  type TaskWithDetails,
  type ProjectWithDetails,
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;

  // Projects
  getUserProjects(userId: string): Promise<ProjectWithDetails[]>;
  getProject(id: string): Promise<ProjectWithDetails | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Project Members
  addProjectMember(member: InsertProjectMember): Promise<ProjectMember>;
  removeProjectMember(projectId: string, userId: string): Promise<void>;
  getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]>;

  // Tasks
  getProjectTasks(projectId: string): Promise<TaskWithDetails[]>;
  getTask(id: string): Promise<TaskWithDetails | undefined>;
  getUserTasks(userId: string): Promise<TaskWithDetails[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task>;
  updateTaskPositions(tasks: { id: string; position: number; status: string }[]): Promise<void>;
  deleteTask(id: string): Promise<void>;

  // Time Entries
  getUserTimeEntries(userId: string, date?: Date): Promise<(TimeEntry & { task: Task & { project: Project } })[]>;
  getActiveTimeEntry(userId: string): Promise<(TimeEntry & { task: Task & { project: Project } }) | undefined>;
  createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: string, updates: Partial<InsertTimeEntry>): Promise<TimeEntry>;
  stopTimeEntry(id: string): Promise<TimeEntry>;
  deleteTimeEntry(id: string): Promise<void>;

  // Analytics
  getUserStats(userId: string): Promise<{
    activeProjects: number;
    completedTasks: number;
    hoursThisMonth: number;
    teamMembers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const result = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getUserProjects(userId: string): Promise<ProjectWithDetails[]> {
    const userProjects = await db
      .select({
        project: projects,
        owner: users,
      })
      .from(projects)
      .leftJoin(users, eq(projects.ownerId, users.id))
      .leftJoin(projectMembers, eq(projects.id, projectMembers.projectId))
      .where(
        and(
          eq(projects.ownerId, userId)
        )
      )
      .orderBy(desc(projects.createdAt));

    return userProjects.map(({ project, owner }) => ({
      ...project,
      owner: owner!,
    }));
  }

  async getProject(id: string): Promise<ProjectWithDetails | undefined> {
    const result = await db
      .select({
        project: projects,
        owner: users,
      })
      .from(projects)
      .leftJoin(users, eq(projects.ownerId, users.id))
      .where(eq(projects.id, id));

    if (!result[0]) return undefined;

    const { project, owner } = result[0];
    return {
      ...project,
      owner: owner!,
    };
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0] as Project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const result = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0] as Project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async addProjectMember(member: InsertProjectMember): Promise<ProjectMember> {
    const result = await db.insert(projectMembers).values(member).returning();
    return result[0];
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await db
      .delete(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.userId, userId)
        )
      );
  }

  async getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]> {
    const result = await db
      .select({
        member: projectMembers,
        user: users,
      })
      .from(projectMembers)
      .leftJoin(users, eq(projectMembers.userId, users.id))
      .where(eq(projectMembers.projectId, projectId));

    return result.map(({ member, user }) => ({
      ...member,
      user: user!,
    }));
  }

  async getProjectTasks(projectId: string): Promise<TaskWithDetails[]> {
    const result = await db
      .select({
        task: tasks,
        assignee: users,
        project: projects,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(tasks.projectId, projectId))
      .orderBy(asc(tasks.position));

    return result.map(({ task, assignee, project }) => ({
      ...task,
      assignee: assignee || undefined,
      project: project!,
    }));
  }

  async getTask(id: string): Promise<TaskWithDetails | undefined> {
    const result = await db
      .select({
        task: tasks,
        assignee: users,
        project: projects,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(tasks.id, id));

    if (!result[0]) return undefined;

    const { task, assignee, project } = result[0];
    return {
      ...task,
      assignee: assignee || undefined,
      project: project!,
    };
  }

  async getUserTasks(userId: string): Promise<TaskWithDetails[]> {
    const result = await db
      .select({
        task: tasks,
        assignee: users,
        project: projects,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(tasks.assigneeId, userId))
      .orderBy(desc(tasks.createdAt));

    return result.map(({ task, assignee, project }) => ({
      ...task,
      assignee: assignee || undefined,
      project: project!,
    }));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0] as Task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task> {
    const result = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0] as Task;
  }

  async updateTaskPositions(taskUpdates: { id: string; position: number; status: string }[]): Promise<void> {
    for (const taskUpdate of taskUpdates) {
      await db
        .update(tasks)
        .set({ 
          position: taskUpdate.position, 
          status: taskUpdate.status,
          updatedAt: new Date()
        })
        .where(eq(tasks.id, taskUpdate.id));
    }
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getUserTimeEntries(userId: string, date?: Date): Promise<(TimeEntry & { task: Task & { project: Project } })[]> {
    let query = db
      .select({
        timeEntry: timeEntries,
        task: tasks,
        project: projects,
      })
      .from(timeEntries)
      .leftJoin(tasks, eq(timeEntries.taskId, tasks.id))
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(timeEntries.userId, userId));

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const result = await db
        .select({
          timeEntry: timeEntries,
          task: tasks,
          project: projects,
        })
        .from(timeEntries)
        .leftJoin(tasks, eq(timeEntries.taskId, tasks.id))
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .where(
          and(
            eq(timeEntries.userId, userId),
            // Note: Add date filtering logic here when needed
          )
        )
        .orderBy(desc(timeEntries.createdAt));

      return result.map(({ timeEntry, task, project }) => ({
        ...timeEntry,
        task: {
          ...task!,
          project: project!,
        },
      }));
    }

    const result = await query.orderBy(desc(timeEntries.createdAt));

    return result.map(({ timeEntry, task, project }) => ({
      ...timeEntry,
      task: {
        ...task!,
        project: project!,
      },
    }));
  }

  async getActiveTimeEntry(userId: string): Promise<(TimeEntry & { task: Task & { project: Project } }) | undefined> {
    const result = await db
      .select({
        timeEntry: timeEntries,
        task: tasks,
        project: projects,
      })
      .from(timeEntries)
      .leftJoin(tasks, eq(timeEntries.taskId, tasks.id))
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(timeEntries.userId, userId),
          eq(timeEntries.isRunning, true)
        )
      );

    if (!result[0]) return undefined;

    const { timeEntry, task, project } = result[0];
    return {
      ...timeEntry,
      task: {
        ...task!,
        project: project!,
      },
    };
  }

  async createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry> {
    const result = await db.insert(timeEntries).values(timeEntry).returning();
    return result[0];
  }

  async updateTimeEntry(id: string, updates: Partial<InsertTimeEntry>): Promise<TimeEntry> {
    const result = await db
      .update(timeEntries)
      .set(updates)
      .where(eq(timeEntries.id, id))
      .returning();
    return result[0];
  }

  async stopTimeEntry(id: string): Promise<TimeEntry> {
    const now = new Date();
    const entry = await db.select().from(timeEntries).where(eq(timeEntries.id, id));
    
    if (!entry[0]) throw new Error("Time entry not found");
    
    const startTime = new Date(entry[0].startTime);
    const minutes = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));

    const result = await db
      .update(timeEntries)
      .set({
        endTime: now,
        minutes,
        isRunning: false,
      })
      .where(eq(timeEntries.id, id))
      .returning();

    return result[0];
  }

  async deleteTimeEntry(id: string): Promise<void> {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));
  }

  async getUserStats(userId: string): Promise<{
    activeProjects: number;
    completedTasks: number;
    hoursThisMonth: number;
    teamMembers: number;
  }> {
    // Get active projects count
    const activeProjectsResult = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.ownerId, userId),
          eq(projects.status, "active")
        )
      );

    // Get completed tasks count
    const completedTasksResult = await db
      .select()
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(projects.ownerId, userId),
          eq(tasks.status, "done")
        )
      );

    // Get hours this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const hoursResult = await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.userId, userId));

    const totalMinutes = hoursResult
      .filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= startOfMonth && entryDate <= endOfMonth;
      })
      .reduce((sum, entry) => sum + (entry.minutes || 0), 0);

    // Get team members count (unique members across all user's projects)
    const teamMembersResult = await db
      .select()
      .from(projectMembers)
      .leftJoin(projects, eq(projectMembers.projectId, projects.id))
      .where(eq(projects.ownerId, userId));

    const uniqueMembers = new Set(teamMembersResult.map(m => m.project_members?.userId)).size;

    return {
      activeProjects: activeProjectsResult.length,
      completedTasks: completedTasksResult.length,
      hoursThisMonth: Math.round(totalMinutes / 60),
      teamMembers: uniqueMembers,
    };
  }
}

export const storage = new DatabaseStorage();
