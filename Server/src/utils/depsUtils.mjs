import dotenv from "dotenv";
import { Department } from "../DB/Schemas/depsSchema.mjs";

dotenv.config();

// const connectionString = process.env.CONNECTION_STRING;

// mongoose
//   .connect(connectionString)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

export const addDepartment = async (depsData) => {
  try {
    const newDepartment = new Department(depsData);
    await newDepartment.save();
    return newDepartment;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add department");
  }
};

export const removeDepartment = async (ID) => {
  try {
    const deletedDepartment = await Department.findOneAndDelete({
      ID: ID,
    });
    if (!deletedDepartment) {
      throw new Error("Department not found");
    }
    return deletedDepartment;
  } catch (error) {
    throw new Error("Failed to remove department");
  }
};

export const getDepartmentById = async (ID) => {
  try {
    const department = await Department.findOne({ id: ID });
    if (!department) {
      throw new Error("Department not found");
    }
    return department;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch department");
  }
};

export const addSubDepartment = async (ID, subDeptId) => {
  try {
    const department = await Department.findOne({ ID: ID });
    if (!department) {
      throw new Error("Department not found");
    }
    if (!department.subDepartments.includes(subDeptId)) {
      department.subDepartments.push(subDeptId);
      await department.save();
    }
    return department;
  } catch (error) {
    throw new Error("Failed to add sub-department to department");
  }
};

export const removeSubDepartment = async (ID, subDeptId) => {
  try {
    const department = await Department.findOne({ ID: ID });
    if (!department) {
      throw new Error("Department not found");
    }
    department.subDepartments = department.subDepartments.filter(
      (subdep) => subdep !== subDeptId
    );
    await department.save();
    return department;
  } catch (error) {
    throw new Error("Failed to remove sub-department from department");
  }
};

export const addLeadToDepartment = async (ID, userId) => {
  try {
    const department = await Department.findOne({ ID: ID });
    if (!department) {
      throw new Error("Department not found");
    }
    if (!department.departmentLeads.includes(userId)) {
      department.departmentLeads.push(userId);
      await department.save();
    }
    return department;
  } catch (error) {
    throw new Error("Failed to add lead to department");
  }
};

export const removeLeadFromDepartment = async (ID, userId) => {
  try {
    const department = await Department.findOne({ ID: ID });
    if (!department) {
      throw new Error("Department not found");
    }
    department.departmentLeads = department.departmentLeads.filter(
      (user) => user !== userId
    );
    await department.save();
    return department;
  } catch (error) {
    throw new Error("Failed to remove lead from department");
  }
};
