import { render, screen } from '@testing-library/react';
import Pie from '.';

test('renders learn react link', () => {
  render(<Pie percentage={1} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
