import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock clarity functions and environment
const mockClarity = {
  contracts: {
    trainingCertification: {
      addTrainingCourse: vi.fn(),
      recordTrainingCompletion: vi.fn(),
      updateCourseStatus: vi.fn(),
      getTrainingCourse: vi.fn(),
      getCompletedTraining: vi.fn(),
      isCertified: vi.fn()
    }
  },
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  }
};

// Mock the blockchain environment
global.clarity = mockClarity;

describe('Training Certification Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  describe('addTrainingCourse', () => {
    it('should add a new training course', async () => {
      // Setup
      mockClarity.contracts.trainingCertification.addTrainingCourse.mockResolvedValue({
        result: { value: 1 },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.trainingCertification.addTrainingCourse(
          'First Aid', 'Basic first aid training', 8
      );
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(1);
      expect(mockClarity.contracts.trainingCertification.addTrainingCourse)
          .toHaveBeenCalledWith('First Aid', 'Basic first aid training', 8);
    });
  });
  
  describe('recordTrainingCompletion', () => {
    it('should record a completed training for a firefighter', async () => {
      // Setup
      const certificateHash = new Uint8Array(32).fill(1);
      mockClarity.contracts.trainingCertification.recordTrainingCompletion.mockResolvedValue({
        result: { value: true },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.trainingCertification.recordTrainingCompletion(
          1, 2, 'John Instructor', 95, certificateHash
      );
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(true);
      expect(mockClarity.contracts.trainingCertification.recordTrainingCompletion)
          .toHaveBeenCalledWith(1, 2, 'John Instructor', 95, certificateHash);
    });
  });
  
  describe('isCertified', () => {
    it('should check if a firefighter is certified for a course', async () => {
      // Setup
      mockClarity.contracts.trainingCertification.isCertified.mockResolvedValue({
        result: { value: true },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.trainingCertification.isCertified(1, 2);
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toBe(true);
      expect(mockClarity.contracts.trainingCertification.isCertified)
          .toHaveBeenCalledWith(1, 2);
    });
  });
  
  describe('getTrainingCourse', () => {
    it('should return training course data', async () => {
      // Setup
      const mockCourse = {
        name: 'First Aid',
        description: 'Basic first aid training',
        'hours-required': 8,
        active: true
      };
      
      mockClarity.contracts.trainingCertification.getTrainingCourse.mockResolvedValue({
        result: { value: mockCourse },
        isOk: true
      });
      
      // Execute
      const result = await mockClarity.contracts.trainingCertification.getTrainingCourse(1);
      
      // Verify
      expect(result.isOk).toBe(true);
      expect(result.result.value).toEqual(mockCourse);
      expect(mockClarity.contracts.trainingCertification.getTrainingCourse)
          .toHaveBeenCalledWith(1);
    });
  });
});
