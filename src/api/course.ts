import { baseUrl } from "./base";

type createCourse = {
  name: string;
  description?: string;
  coverImage: string;
  price: number;
  creator: string;
  categoryId: number;
  sections:{
    title: string;
    description?: string;
    videoUrl: string;
    order: number;
  }[];
}

export async function createCourse(courseData: createCourse) {
    console.log(JSON.stringify(courseData));
  const response = await fetch(`${baseUrl}/course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseData),
  });
  return await response.json();
}

export async function deleteCourse(courseId: string) {
  const response = await fetch(`${baseUrl}/course/${courseId}`, {
    method: "DELETE",
  });
  return await response.json();
}
