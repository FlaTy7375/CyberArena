import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { bookingSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Booking API endpoint
  app.post("/api/booking", async (req, res) => {
    try {
      const result = bookingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Ошибка валидации",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const booking = await storage.createBooking(result.data);
      
      return res.status(201).json({ 
        message: "Бронирование успешно создано",
        booking 
      });
    } catch (error) {
      console.error("Booking error:", error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  // Get all bookings (for admin purposes)
  app.get("/api/bookings", async (_req, res) => {
    try {
      const bookings = await storage.getBookings();
      return res.json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  return httpServer;
}
