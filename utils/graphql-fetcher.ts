import { nhost } from './nhost';

type AuthHeaderProps = {
  authorization: string;
};

export const fetchData = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers']
): (() => Promise<TData>) => {
  return async () => {
    const authHeaders = {} as AuthHeaderProps;

    if (nhost.auth.isAuthenticated()) {
      authHeaders['authorization'] = `Bearer ${nhost.auth.getAccessToken()}`;
    }

    const res = await fetch(nhost.graphql.getUrl(), {
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options ?? {}),
      },
      method: 'POST',
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || 'Error..';
      throw new Error(message);
    }

    return json.data;
  };
};
