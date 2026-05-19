-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "depositPaidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "paypalOrderId" TEXT;
