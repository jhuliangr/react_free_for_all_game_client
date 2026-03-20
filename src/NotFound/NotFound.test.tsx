import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NotFound } from './';

describe('NotFound component works as expected', () => {
  it('works', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
  });
});
