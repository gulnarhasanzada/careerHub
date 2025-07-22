import { User, UserRole } from '@career-hub/shared-types'
import { HTTP_STATUS } from '@career-hub/shared-utils';

export default function Home() {
  const testUser: User = {
      id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  return (
   <main className="p-8">
      <h1 className="text-2xl font-bold">Career Hub - Shell App</h1>
      <p>Welcome {testUser.firstName} {testUser.lastName} {HTTP_STATUS.BAD_REQUEST}!</p>
    </main>
  );
}
