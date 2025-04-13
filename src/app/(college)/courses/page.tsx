import CoursesClient from "@/components/course/CoursesClient";

export default function CoursesPage() {
  return (
    <div className="container mx-auto max-w-7xl py-32 px-8">
      {/* CoursesClient 组件，该组件将渲染用户已购买的课程、证书和代币余额信息 */}
      <CoursesClient />
    </div>
  );
}
