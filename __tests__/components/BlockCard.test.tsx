import { render, screen } from '@testing-library/react';
import BlockCard from '@/components/BlockCard';

describe('BlockCard Component', () => {
  const mockBlock = {
    number: 12345678,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: 1623456789,
    miner: '0xabcdef1234567890abcdef1234567890abcdef12',
    transactions: 123,
    gasUsed: '5000000',
    gasLimit: '15000000',
  };

  it('renders block information correctly', () => {
    render(<BlockCard block={mockBlock} />);
    
    // Check if block number is displayed
    expect(screen.getByText('#12345678')).toBeInTheDocument();
    
    // Check if hash is displayed (at least partially)
    expect(screen.getByText(/0x1234.*abcdef/)).toBeInTheDocument();
    
    // Check if transaction count is displayed
    expect(screen.getByText('123')).toBeInTheDocument();
    
    // Check if miner address is displayed (at least partially)
    expect(screen.getByText(/0xabcd.*ef12/)).toBeInTheDocument();
    
    // Check if gas information is displayed
    expect(screen.getByText('5,000,000 / 15,000,000')).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    render(<BlockCard block={mockBlock} />);
    
    // Check if card has the right classes
    const card = screen.getByTestId('block-card');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('dark:bg-gray-800');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('shadow-md');
  });
}); 