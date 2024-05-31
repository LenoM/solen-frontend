import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserForm from "@/features/user/form";

export default function UserDetail() {
  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center mx-auto">
        <Card className="xl:w-[600px] md:w-[600px] mb-12">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center">Usuário</h1>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
