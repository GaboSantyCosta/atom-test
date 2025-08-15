export interface Task {
    id: number;
    title: string;
    description: string;
    createAt: number;
    status: "pending" | "in progress" | "done";
    uid: string;
}