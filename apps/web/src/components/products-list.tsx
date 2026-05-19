'use client';

import { createUser } from '@/services/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';

interface User {
  id: number;
  name: string;
}

function ProductsList() {
  // const queryClient = useQueryClient();

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['users'],
  //   queryFn: getUsers,
  // });

  // const mutation = useMutation({
  //   mutationFn: createUser,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //   },
  // });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (isError) {
  //   return <div>Error loading users</div>;
  // }

  return (
    <>
      {/* <Button onClick={() => mutation.mutate({ id: 1, name: 'sth ' })}>Create user</Button>
      <ul>
        {data.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul> */}
      product lists here
    </>
  );
}

export default ProductsList;
