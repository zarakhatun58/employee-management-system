import { Response } from "express";
import { Employee } from "../models/Employee";
import { AuthRequest } from "../middleware/auth.middleware";

export const dashboardController = {
  async stats(_req: AuthRequest, res: Response) {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departments,
      roles,
    ] = await Promise.all([
      Employee.countDocuments({
        deleted: false,
      }),

      Employee.countDocuments({
        deleted: false,
        status: "active",
      }),

      Employee.countDocuments({
        deleted: false,
        status: "inactive",
      }),

      Employee.aggregate([
        {
          $match: {
            deleted: false,
          },
        },
        {
          $group: {
            _id: "$department",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      Employee.aggregate([
        {
          $match: {
            deleted: false,
          },
        },
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthly = await Employee.aggregate([
      {
        $match: {
          deleted: false,
          joiningDate: {
            $gte: sixMonthsAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$joiningDate",
            },
            month: {
              $month: "$joiningDate",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyJoinings = monthly.map((item) => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully.",

      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,

        departmentCount: departments.length,

        departments: departments.map((d) => ({
          department: d._id,
          count: d.count,
        })),

        roleDistribution: roles.map((r) => ({
          role: r._id,
          count: r.count,
        })),

        monthlyJoinings,
      },
    });
  },
};