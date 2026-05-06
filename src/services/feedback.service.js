const prisma = require('../utils/prisma');

// ── Kullanıcı İşlemleri ──────────────────────
const createReport = async (userId, { puzzleId, type, message }) => {
  return prisma.report.create({
    data: { userId, puzzleId, type, message }
  });
};

const createTicket = async (userId, { subject, message }) => {
  return prisma.supportTicket.create({
    data: { userId, subject, message }
  });
};

const deleteTicket = async (id) => {
  return prisma.supportTicket.delete({
    where: { id }
  });
};

const getMyTickets = async (userId) => {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

// ── Admin İşlemleri ──────────────────────────
const getReports = async ({ status, page = 1, limit = 20 } = {}) => {
  const where = status ? { status } : {};
  const skip = (page - 1) * limit;
  
  const [reports, total] = await prisma.$transaction([
    prisma.report.findMany({
      where, skip, take: limit,
      include: { 
        user: { select: { username: true, email: true } },
        puzzle: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.report.count({ where })
  ]);
  
  return { reports, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const updateReportStatus = async (id, status) => {
  return prisma.report.update({
    where: { id },
    data: { status }
  });
};

const getTickets = async ({ status, page = 1, limit = 20 } = {}) => {
  const where = status ? { status } : {};
  const skip = (page - 1) * limit;
  
  const [tickets, total] = await prisma.$transaction([
    prisma.supportTicket.findMany({
      where, skip, take: limit,
      include: { user: { select: { username: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.supportTicket.count({ where })
  ]);
  
  return { tickets, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const respondToTicket = async (id, response) => {
  return prisma.supportTicket.update({
    where: { id },
    data: { response, status: 'RESOLVED' }
  });
};

const updateTicketStatus = async (id, status) => {
  return prisma.supportTicket.update({
    where: { id },
    data: { status }
  });
};

module.exports = {
  createReport, createTicket, getMyTickets, deleteTicket,
  getReports, updateReportStatus,
  getTickets, respondToTicket, updateTicketStatus
};
