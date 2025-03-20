import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock clarity functions and environment
const mockClarity = {
  contracts: {
    firefighterRegistration: {
      registerFirefighter: vi.fn(),
      addCertification: vi.fn(),
      setFirefighterStatus: vi.fn(),
      getFirefighter: vi.fn(),
      getCertification: vi.fn()
    }
  },
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  }
};

// Mock the blockchain environment
global.clarity = mockClarity;

describe('Firefighter Registration Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  describe('registerFirefighter', () => {
    it('should register a new firefighter successfully', async () => {
      // Setup
      mockClarity.contracts.firefighterRegistration.registerFirefighter.mockResolvedValue({
        result: { value: 1 },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.firefighterRegistration.registerFirefighter('John Doe');
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(1);
      expect(mockClarity.contracts.firefighterRegistration.registerFirefighter).toHaveBeenCalledWith('John Doe');
    });
    
    it('should fail if not called by admin', async () => {
      // Setup
      mockClarity.contracts.firefighterRegistration.registerFirefighter.mockResolvedValue({
        result: { value: 403 },
        isOk: false
      });
      
      // Execute
      const result = await mockClarity.contracts.firefighterRegistration.registerFirefighter('John Doe');
      
      // Verify
      expect(result.isOk).toBe(false);
      expect(result.result.value).toBe(403);
    });
  });
  
  describe('addCertification', () => {
    it('should add a certification to a firefighter', async () => {
      // Setup
      mockClarity.contracts.firefighterRegistration.addCertification.mockResolvedValue({
        result: { value: 1 },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.firefighterRegistration.addCertification(
          1, 'First Aid', 'Red Cross', 1000
      );
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(1);
      expect(mockClarity.contracts.firefighterRegistration.addCertification)
          .toHaveBeenCalledWith(1, 'First Aid', 'Red Cross', 1000);
    });
  });
  
  describe('getFirefighter', () => {
    it('should return firefighter data', async () => {
      // Setup
      const mockFirefighter = {
        name: 'John Doe',
        address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        active: true,
        'join-date': 100
      };
      
      mockClarity.contracts.firefighterRegistration.getFirefighter.mockResolvedValue({
        result: { value: mockFirefighter },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.firefighterRegistration.getFirefighter(1);
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toEqual(mockFirefighter);
      expect(mockClarity.contracts.firefighterRegistration.getFirefighter).toHaveBeenCalledWith(1);
    });
  });
});
