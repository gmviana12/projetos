import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertTaskSchema, insertTimeEntrySchema, insertProjectMemberSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get("/api/auth/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      console.log("Creating project with data:", req.body);
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const updates = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, updates);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ message: "Project deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const projectId = req.query.projectId as string;
      const userId = req.query.userId as string;

      if (projectId) {
        const tasks = await storage.getProjectTasks(projectId);
        res.json(tasks);
      } else if (userId) {
        const tasks = await storage.getUserTasks(userId);
        res.json(tasks);
      } else {
        res.status(400).json({ message: "projectId or userId is required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const updates = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, updates);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/tasks/positions", async (req, res) => {
    try {
      const schema = z.array(z.object({
        id: z.string(),
        position: z.number(),
        status: z.string(),
      }));
      const updates = schema.parse(req.body);
      await storage.updateTaskPositions(updates);
      res.json({ message: "Task positions updated" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Time tracking routes
  app.get("/api/time-entries", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const timeEntries = await storage.getUserTimeEntries(userId, date);
      res.json(timeEntries);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/time-entries/active", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const activeEntry = await storage.getActiveTimeEntry(userId);
      res.json(activeEntry || null);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/time-entries", async (req, res) => {
    try {
      const timeEntryData = insertTimeEntrySchema.parse(req.body);
      const timeEntry = await storage.createTimeEntry(timeEntryData);
      res.json(timeEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/time-entries/:id/stop", async (req, res) => {
    try {
      const timeEntry = await storage.stopTimeEntry(req.params.id);
      res.json(timeEntry);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/time-entries/:id", async (req, res) => {
    try {
      await storage.deleteTimeEntry(req.params.id);
      res.json({ message: "Time entry deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Project Members routes
  app.get("/api/project-members", async (req, res) => {
    try {
      const projectId = req.query.projectId as string;
      if (!projectId) {
        return res.status(400).json({ message: "projectId is required" });
      }
      const members = await storage.getProjectMembers(projectId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/project-members", async (req, res) => {
    try {
      const memberData = insertProjectMemberSchema.parse(req.body);
      const member = await storage.addProjectMember(memberData);
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/project-members/:projectId/:userId", async (req, res) => {
    try {
      await storage.removeProjectMember(req.params.projectId, req.params.userId);
      res.json({ message: "Member removed" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stats route
  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Power BI export route
  app.get("/api/export/powerbi", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const [projects, tasks, timeEntries] = await Promise.all([
        storage.getUserProjects(userId),
        storage.getUserTasks(userId),
        storage.getUserTimeEntries(userId),
      ]);

      const exportData = {
        projects: projects.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          projectId: t.projectId,
          projectName: t.project.name,
          assigneeId: t.assigneeId,
          assigneeName: t.assignee?.fullName,
          dueDate: t.dueDate,
          completedAt: t.completedAt,
          estimatedMinutes: t.estimatedMinutes,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
        timeEntries: timeEntries.map(te => ({
          id: te.id,
          taskId: te.taskId,
          taskTitle: te.task.title,
          projectId: te.task.projectId,
          projectName: te.task.project.name,
          userId: te.userId,
          description: te.description,
          startTime: te.startTime,
          endTime: te.endTime,
          minutes: te.minutes,
          isRunning: te.isRunning,
          createdAt: te.createdAt,
        })),
      };

      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
