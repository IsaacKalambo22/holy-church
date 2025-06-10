'use server';

import { revalidatePath } from 'next/cache';
import config from '@/lib/config';
import { Sermon, SermonsResponse, SermonsQueryParams } from './types';
import { ApiResponse } from '@/lib/api';

export const fetchSermons = async (params: SermonsQueryParams = {}): Promise<ApiResponse<SermonsResponse>> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.preacher) queryParams.append('preacher', params.preacher);
    
    const url = `sermons?${queryParams.toString()}`;
    
    const response = await fetch(`${config.env.baseUrl}/${url}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sermons: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Sermons fetched successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return {
      success: false,
      message: 'Failed to fetch sermons',
      data: { sermons: [], totalCount: 0, currentPage: 1, totalPages: 0 } as SermonsResponse,
    };
  }
}; 