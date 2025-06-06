import { Permission } from './permissions.enum';
import { UserRole } from '../../../common/enums/roles.enum';

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    // Admins have all permissions
    ...Object.values(Permission),
  ],

  [UserRole.PET_OWNER]: [
    // Pet owners can manage their own animals and view their appointments
    Permission.READ_USER,
    Permission.UPDATE_USER,

    Permission.CREATE_ANIMAL,
    Permission.READ_ANIMAL,
    Permission.UPDATE_ANIMAL,
    Permission.DELETE_ANIMAL,

    Permission.READ_MEDICAL_RECORD,

    Permission.CREATE_APPOINTMENT,
    Permission.READ_APPOINTMENT,
    Permission.UPDATE_APPOINTMENT,
    Permission.DELETE_APPOINTMENT,

    Permission.READ_CONSULTATION,

    Permission.READ_CLINIC,
    Permission.READ_AVAILABILITY,

    Permission.CREATE_PAYMENT,
    Permission.READ_PAYMENT,
  ],

  [UserRole.VETERINARIAN]: [
    // Veterinarians can manage medical records, consultations, and their availability
    Permission.READ_USER,
    Permission.UPDATE_USER,

    Permission.READ_ANIMAL,

    Permission.CREATE_MEDICAL_RECORD,
    Permission.READ_MEDICAL_RECORD,
    Permission.UPDATE_MEDICAL_RECORD,

    Permission.READ_APPOINTMENT,
    Permission.UPDATE_APPOINTMENT,

    Permission.CREATE_CONSULTATION,
    Permission.READ_CONSULTATION,
    Permission.UPDATE_CONSULTATION,

    Permission.READ_CLINIC,

    Permission.CREATE_AVAILABILITY,
    Permission.READ_AVAILABILITY,
    Permission.UPDATE_AVAILABILITY,
    Permission.DELETE_AVAILABILITY,

    Permission.READ_PAYMENT,
  ],
};
