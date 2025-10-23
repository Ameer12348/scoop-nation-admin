import api from '@/lib/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  subject: string;
  body_html: string;
  variables: string | null;
  is_active: string;
  created_at: string;
  updated_at: string;
}

interface EmailTemplateState {
  emailTemplates: EmailTemplate[];
  pagination: null | {
    limit: number;
    page: number;
    total_pages: number;
    total: string;
  };
  currentEmailTemplate: {
    data: null | EmailTemplate;
    loading: boolean;
    error: null | string;
  };
  updateEmailTemplate: {
    loading: boolean;
    error: null | string;
  };
  createEmailTemplate: {
    loading: boolean;
    error: null | string;
    templateId: string | null;
  };
  deleteEmailTemplate: {
    loading: boolean;
    error: null | string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: EmailTemplateState = {
  emailTemplates: [],
  pagination: null,
  currentEmailTemplate: {
    data: null,
    loading: false,
    error: null,
  },
  updateEmailTemplate: {
    loading: false,
    error: null,
  },
  createEmailTemplate: {
    loading: false,
    error: null,
    templateId: null,
  },
  deleteEmailTemplate: {
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
};

export const fetchEmailTemplates = createAsyncThunk(
  'emailTemplates/fetchEmailTemplates',
  async (params: { page?: number, limit?: number, search?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const url = `/api/email_templates${queryString ? `?${queryString}` : ''}`;
      const response = await api.get(url);

      if (!response.data.success) {
        throw new Error('Failed to fetch email templates');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const fetchEmailTemplateById = createAsyncThunk(
  'emailTemplates/fetchEmailTemplateById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/email_templates/get?id=${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch email template');
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

interface CreateEmailTemplatePayload {
  name: string;
  slug: string;
  subject: string;
  body_html: string;
  variables?: string;
  is_active: boolean;
}

interface UpdateEmailTemplatePayload {
  id: number;
  name?: string;
  slug?: string;
  subject?: string;
  body_html?: string;
  variables?: string;
  is_active?: boolean;
}

export const createEmailTemplate = createAsyncThunk(
  'emailTemplates/createEmailTemplate',
  async (templateData: CreateEmailTemplatePayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/email_templates/create', templateData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create email template');
      }

      toast.success(response.data.message || 'Email template created successfully');
      return response.data.data.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEmailTemplate = createAsyncThunk(
  'emailTemplates/updateEmailTemplate',
  async (templateData: UpdateEmailTemplatePayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/email_templates/update', templateData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update email template');
      }

      toast.success(response.data.message || 'Email template updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteEmailTemplate = createAsyncThunk(
  'emailTemplates/deleteEmailTemplate',
  async (id: number | string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete('/api/email_templates/delete', {
        data: { id }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete email template');
      }

      toast.success(response.data.message || 'Email template deleted successfully');
      dispatch(fetchEmailTemplates({}));
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const emailTemplateSlice = createSlice({
  name: 'emailTemplates',
  initialState,
  reducers: {
    clearEmailTemplateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailTemplates.fulfilled, (state, action: PayloadAction<{
        data: EmailTemplate[], pagination: {
          limit: number;
          page: number;
          total_pages: number;
          total: string;
        }
      }>) => {
        state.loading = false;
        state.emailTemplates = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmailTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEmailTemplateById.pending, (state) => {
        state.currentEmailTemplate.loading = true;
        state.currentEmailTemplate.error = null;
      })
      .addCase(fetchEmailTemplateById.fulfilled, (state, action: PayloadAction<EmailTemplate>) => {
        state.currentEmailTemplate.loading = false;
        state.currentEmailTemplate.data = action.payload;
      })
      .addCase(fetchEmailTemplateById.rejected, (state, action) => {
        state.currentEmailTemplate.loading = false;
        state.currentEmailTemplate.error = action.payload as string;
        state.currentEmailTemplate.data = null;
      })
      .addCase(createEmailTemplate.pending, (state) => {
        state.createEmailTemplate.loading = true;
        state.createEmailTemplate.error = null;
        state.createEmailTemplate.templateId = null;
      })
      .addCase(createEmailTemplate.fulfilled, (state, action: PayloadAction<string>) => {
        state.createEmailTemplate.loading = false;
        state.createEmailTemplate.templateId = action.payload;
      })
      .addCase(createEmailTemplate.rejected, (state, action) => {
        state.createEmailTemplate.loading = false;
        state.createEmailTemplate.error = action.payload as string;
      })
      .addCase(updateEmailTemplate.pending, (state) => {
        state.updateEmailTemplate.loading = true;
        state.updateEmailTemplate.error = null;
      })
      .addCase(updateEmailTemplate.fulfilled, (state) => {
        state.updateEmailTemplate.loading = false;
        state.updateEmailTemplate.error = null;
      })
      .addCase(updateEmailTemplate.rejected, (state, action) => {
        state.updateEmailTemplate.loading = false;
        state.updateEmailTemplate.error = action.payload as string;
      })
      .addCase(deleteEmailTemplate.pending, (state) => {
        state.deleteEmailTemplate.loading = true;
        state.deleteEmailTemplate.error = null;
      })
      .addCase(deleteEmailTemplate.fulfilled, (state) => {
        state.deleteEmailTemplate.loading = false;
        state.deleteEmailTemplate.error = null;
      })
      .addCase(deleteEmailTemplate.rejected, (state, action) => {
        state.deleteEmailTemplate.loading = false;
        state.deleteEmailTemplate.error = action.payload as string;
      });
  },
});

export const { clearEmailTemplateError } = emailTemplateSlice.actions;
export default emailTemplateSlice.reducer;

export const selectEmailTemplates = (state: { emailTemplates: EmailTemplateState }) => state.emailTemplates.emailTemplates;
export const selectCurrentEmailTemplate = (state: { emailTemplates: EmailTemplateState }) => state.emailTemplates.currentEmailTemplate;
export const selectEmailTemplatesLoading = (state: { emailTemplates: EmailTemplateState }) => state.emailTemplates.loading;
export const selectEmailTemplatesError = (state: { emailTemplates: EmailTemplateState }) => state.emailTemplates.error;
export const selectCreateEmailTemplate = (state: { emailTemplates: EmailTemplateState }) => state.emailTemplates.createEmailTemplate;
export const selectDeleteEmailTemplate = (state: { emailTemplates: EmailTemplateState }) => state.emailTemplates.deleteEmailTemplate;