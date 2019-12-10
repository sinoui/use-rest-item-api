import { renderHook } from '@testing-library/react-hooks';
import useRestItemApi from '.';

it('在id为空时，isLoading应为false', () => {
  const { result } = renderHook(() => useRestItemApi('/users'));

  expect(result.current.isLoading).toBe(false);
});
