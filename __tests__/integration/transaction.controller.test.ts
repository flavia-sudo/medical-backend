import request from "supertest";
import express from "express";
import * as TransactionController from "../../src/transaction/transaction.controller";
import * as TransactionService from "../../src/transaction/transaction.service";

const app = express();
app.use(express.json());

app.post("/transaction", TransactionController.createTransactionController as any);
app.get("/transaction_all", TransactionController.getTransactionController as any);
app.get("/transaction/:transactionId", TransactionController.getTransactionByIdController as any);
app.put("/transaction/:transactionId", TransactionController.updateTransactionController as any);
app.delete("/transaction/:transactionId", TransactionController.deleteTransactionController as any);
jest.mock('../../src/Drizzle/db', () => ({
    client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));

jest.mock("../../src/transaction/transaction.service");

describe("Transaction Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /transaction", () => {
      it("should create a new transaction", async () => {
        (TransactionService.createTransactionService as jest.Mock).mockResolvedValueOnce({ transactionId: 1 });
          
          const response = await request(app).post("/transaction").send({
            userId: 1,
            transactionName: "consultation fee",
            amount: '150.00',
            status: true,
          });          
          expect(response.status).toBe(201);
          expect(response.body.message).toBe("Transaction created successfully");
        });
        it("should return 400 if user not found", async () => {
            (TransactionService.createTransactionService as jest.Mock).mockResolvedValueOnce(null);
            const response = await request(app).post("/transaction").send({
                userId: 1,
                transactionName: "consultation fee",
                amount: '150.00',
                status: true,
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message:"Failed to create transaction" });
        })
      it("should return 500 if an error occurs", async () => {
        (TransactionService.createTransactionService as jest.Mock).mockRejectedValue(new Error("Failed to create transaction"));
        const response = await request(app).post("/transaction").send({
          userId: 1,
          transactionName: "consultation fee",
          amount: '150.00',
          status: true,
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to create transaction" });
      });
    });

    describe("GET /transaction_all", () => {
      it("should return all transactions", async () => {
        (TransactionService.getTransactionService as jest.Mock).mockResolvedValueOnce([]);
        const response = await request(app).get("/transaction_all");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
      it("should return 500 if an error occurs", async () => {
        (TransactionService.getTransactionService as jest.Mock).mockRejectedValue(new Error("Failed to get transactions"));
        const response = await request(app).get("/transaction_all");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to get transactions" });
      });
    })
    
    describe("GET /transaction/:transactionId", () => {
      it("should return a transaction", async () => {
        (TransactionService.getTransactionByIdService as jest.Mock).mockResolvedValueOnce({ transactionId: 1 });
        const response = await request(app).get("/transaction/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ transactionId: 1 });
      });
      it("should return 400 invalid transaction id", async () => {
        (TransactionService.getTransactionByIdService as jest.Mock).mockResolvedValueOnce(null);
        const response = await request(app).get("/transaction/abc");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid transaction id" });
      });
      it("should return 404 if transaction not found", async () => {
        (TransactionService.getTransactionByIdService as jest.Mock).mockResolvedValueOnce(null);
        const response = await request(app).get("/transaction/999");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Transaction not found" });
      });
      it("should return 500 if an error occurs", async () => {
        jest.resetAllMocks();

        (TransactionService.getTransactionByIdService as jest.Mock).mockImplementation(() => {
          throw new Error("Failed to get transaction");
        });

        const response = await request(app).get("/transaction/1");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to get transaction" });
      });
    })

    describe("PUT /transaction/:transactionId", () => {
      it("should update a transaction", async () => {
        (TransactionService.updateTransactionService as jest.Mock).mockResolvedValueOnce({ transactionId: 1 });
        const response = await request(app).put("/transaction/1").send({
          amount: '200.00',
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Transaction updated successfully");
      });
      it("should return 400 invalid transaction id", async () => {
        (TransactionService.updateTransactionService as jest.Mock).mockResolvedValueOnce(null);
        const response = await request(app).put("/transaction/abc").send({
          amount: '200.00',
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid transaction id" });
      });
      it("should return 404 if transaction not found", async () => {
        (TransactionService.updateTransactionService as jest.Mock).mockResolvedValueOnce(null);
        const response = await request(app).put("/transaction/999").send({
          amount: '200.00',
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Transaction not found" });
      });
      it("should return 500 if an error occurs", async () => {
        jest.resetAllMocks();

        (TransactionService.updateTransactionService as jest.Mock).mockImplementation(() => {
          throw new Error("Failed to update transaction");
        });

        const response = await request(app).put("/transaction/1").send({
          amount: '200.00',
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to update transaction" });
      });

    })

    describe("DELETE /transaction/:transactionId", () => {
      it("should delete a transaction", async () => {
        (TransactionService.getTransactionByIdService as jest.Mock).mockResolvedValue({ transactionId: 1 });
        (TransactionService.deleteTransactionService as jest.Mock).mockResolvedValue(null);
        const response = await request(app).delete("/transaction/1");
        expect(response.status).toBe(204);
      });
      it("should return 400 invalid transaction id", async () => {
        (TransactionService.getTransactionByIdService as jest.Mock).mockResolvedValue({ transactionId: 1 });
        (TransactionService.deleteTransactionService as jest.Mock).mockResolvedValue(null);
        const response = await request(app).delete("/transaction/abc");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid transaction id" });
      });
      it("should return 404 if transaction not found", async () => {
        (TransactionService.getTransactionByIdService as jest.Mock).mockResolvedValue(null);
        (TransactionService.deleteTransactionService as jest.Mock).mockResolvedValue(null);
        const response = await request(app).delete("/transaction/999");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Transaction not found" });
      });
      it("should return 500 if an error occurs", async () => {
        (TransactionService.getTransactionByIdService as jest.Mock).mockResolvedValue({ transactionId: 1 });
        (TransactionService.deleteTransactionService as jest.Mock).mockRejectedValue(new Error("Failed to delete transaction"));
        const response = await request(app).delete("/transaction/1");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to delete transaction" });
      });
    })
})