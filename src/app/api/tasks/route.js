import { connectToDB } from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET() {
  await connectToDB();
  const tasks = await Task.find();
  return Response.json(tasks);
}

export async function POST(request) {
  await connectToDB();
  const { text } = await request.json();
  const task = await Task.create({ text });
  return Response.json(task, { status: 201 });
}
