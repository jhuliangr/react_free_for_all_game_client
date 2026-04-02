import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '.';

describe('Button component works as expected', () => {
  it('works', () => {
    render(<Button>something</Button>);
  });
  it('renders its children', () => {
    const text = 'something';
    render(<Button>{text}</Button>);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
