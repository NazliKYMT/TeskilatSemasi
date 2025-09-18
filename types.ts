export interface BaseEntity {
  id: string;
  name: string;
  reportsTo: string | null;
}

export interface Person extends BaseEntity {
  type: 'person';
  title: string;
  isSecretary?: boolean;
}

export interface Department extends BaseEntity {
  type: 'department';
}

export type OrgEntity = Person | Department;

// FIX: An interface cannot extend a union type. Changed to a type intersection.
// This resolves cascading type errors in other components where TreeNode properties were not accessible.
export type TreeNode = OrgEntity & {
  children: TreeNode[];
  secretary?: TreeNode;
};

export interface ColorTheme {
  name: string;
  label: string;
  bg: string;
  border: string;
  nameText: string;
  titleText: string;
  ring: string;
  departmentBg: string;
}