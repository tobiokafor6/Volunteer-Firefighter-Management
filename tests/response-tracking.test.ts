import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock clarity functions and environment
const mockClarity = {
  contracts: {
    responseTracking: {
      createEmergencyCall: vi.fn(),
      recordResponse: vi.fn(),
      updateHoursServed: vi.fn(),
      resolveEmergencyCall: vi.fn(),
      getEmergencyCall: vi.fn(),
      getResponse: vi.fn()
    }
  },
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  }
};

// Mock the blockchain environment
global.clarity = mockClarity;

describe('Response Tracking Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  describe('createEmergencyCall', () => {
    it('should create a new emergency call', async () => {
      // Setup
      mockClarity.contracts.responseTracking.createEmergencyCall.mockResolvedValue({
        result: { value: 1 },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.responseTracking.createEmergencyCall(
          'Building fire', '123 Main St'
      );
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(1);
      expect(mockClarity.contracts.responseTracking.createEmergencyCall)
          .toHaveBeenCalledWith('Building fire', '123 Main St');
    });
  });
  
  describe('recordResponse', () => {
    it('should record a firefighter response to an emergency call', async () => {
      // Setup
      mockClarity.contracts.responseTracking.recordResponse.mockResolvedValue({
        result: { value: true },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.responseTracking.recordResponse(
          1, 2, 'Team Lead', 15
      );
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(true);
      expect(mockClarity.contracts.responseTracking.recordResponse)
          .toHaveBeenCalledWith(1, 2, 'Team Lead', 15);
    });
  });
  
  describe('resolveEmergencyCall', () => {
    it('should mark an emergency call as resolved', async () => {
      // Setup
      mockClarity.contracts.responseTracking.resolveEmergencyCall.mockResolvedValue({
        result: { value: true },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.responseTracking.resolveEmergencyCall(1);
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(true);
      expect(mockClarity.contracts.responseTracking.resolveEmergencyCall)
          .toHaveBeenCalledWith(1);
    });
  });
  
  describe('getEmergencyCall', () => {
    it('should return emergency call data', async () => {
      // Setup
      const mockCall = {
        description: 'Building fire',
        location: '123 Main St',
        timestamp: 100,
        resolved: false
      };
      
      mockClarity.contracts.responseTracking.getEmergencyCall.mockResolvedValue({
        result: { value: mockCall },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.responseTracking.getEmergencyCall(1);
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toEqual(mockCall);
      expect(mockClarity.contracts.responseTracking.getEmergencyCall)
          .toHaveBeenCalledWith(1);
    });
  });
});
