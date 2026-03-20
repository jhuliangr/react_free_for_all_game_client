import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ComingSoon } from './';

describe('ComingSoon component works as expected', () => {
  it('works', () => {
    render(
      <MemoryRouter>
        <ComingSoon />
      </MemoryRouter>,
    );
  });
});
