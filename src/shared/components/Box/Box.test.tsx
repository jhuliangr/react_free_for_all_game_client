import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box } from './';

describe('Box component works as expected', () => {
  it('works', () => {
    render(<Box>something</Box>);
  });
  it('renders what is inside', () => {
    const text = 'something';
    render(
      <Box>
        <button>{text}</button>
      </Box>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
