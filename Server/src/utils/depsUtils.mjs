import mongoose from 'mongoose';
import dotenv from 'dotenv';
import depsSchema from '../DB/Schemas/depsSchema.mjs';

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const Department =
  mongoose.models.Department || mongoose.model('Departments', depsSchema);

export const addDepartment = async (depsData) => {
  try {
    const newDepartment = new Department(depsData);
    await newDepartment.save();
    return newDepartment;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to add Department');
  }
};

export const removeDepartment = async (depId) => {
  try {
    const deletedDepartment = await Department.findOneAndDelete({
      dep_id: depId,
    });
    if (!deletedDepartment) {
      throw new Error('Department not found');
    }
    return deletedDepartment;
  } catch (error) {
    throw new Error('Failed to remove Department');
  }
};

export const getDepartmentById = async (depId) => {
  try {
    const department = await Department.findOne({ dep_id: depId });
    if (!department) {
      throw new Error('Department not found');
    }
    return department;
  } catch (error) {
    throw new Error('Failed to fetch department');
  }
};

export const addSubDepartment = async (depId, subDepId) => {
  try {
    const department = await Department.findOne({ dep_id: depId });
    if (!department) {
      throw new Error('Club not found');
    }
    if (!department.subdeps.includes(subDepId)) {
      department.subdeps.push(subDepId);
      await department.save();
    }
    return department;
  } catch (error) {
    throw new Error('Failed to add sub department to department');
  }
};

export const removeSubDepartment = async (depId, subDepId) => {
  try {
    const department = await Department.findOne({ dep_id: depId });
    if (!department) {
      throw new Error('Department not found');
    }
    department.subdeps = department.subdeps.filter(
      (subdep) => subdep.toString() !== subDepId
    );
    await department.save();
    return department;
  } catch (error) {
    throw new Error('Failed to remove department from department');
  }
};
export const addLeadToDepartment = async (depId, userId) => {
  try {
    const department = await Department.findOne({ dep_id: depId });
    if (!department) {
      throw new Error('Club not found');
    }
    if (!department.leads.includes(userId)) {
      department.leads.push(userId);
      await department.save();
    }
    return department;
  } catch (error) {
    throw new Error('Failed to add user to club');
  }
};

export const removeLeadFromDepartment = async (depId, userId) => {
  try {
    const department = await Department.findOne({ dep_id: depId });
    if (!department) {
      throw new Error('Club not found');
    }
    department.leads = department.leads.filter(
      (user) => user.toString() !== userId
    );
    await department.save();
    return department;
  } catch (error) {
    throw new Error('Failed to remove user from club');
  }
};
