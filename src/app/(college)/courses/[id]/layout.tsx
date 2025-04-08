import { ReactNode } from "react";

interface CourseDetailLayoutProps {
  children: ReactNode;
}

export default function CourseDetailLayout({ children }: CourseDetailLayoutProps) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {children}
      </div>
    </div>
  );
} 