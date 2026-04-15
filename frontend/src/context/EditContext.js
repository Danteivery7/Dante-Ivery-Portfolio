import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const EditContext = createContext();
const ADMIN_TOKEN_STORAGE_KEY = 'ocs-admin-token';

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
};

export const useEdit = () => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error('useEdit must be used within EditProvider');
  }
  return context;
};

export const EditProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()));
  const [content, setContent] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    api.setAuthToken(storedToken || null);
    setIsAuthenticated(Boolean(storedToken));
    loadContent();
    loadPortfolio();
  }, []);

  const loadContent = async () => {
    try {
      const response = await api.getAllContent();
      const contentMap = {};
      response.data.forEach(item => {
        contentMap[item.content_id] = item.value;
      });
      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadPortfolio = async () => {
    try {
      setIsLoadingPortfolio(true);
      const response = await api.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.login(username, password);
      const { success, token, message } = response.data;

      if (success && token) {
        api.setAuthToken(token);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
        }
        setIsAuthenticated(true);
        return { success: true, message: message || 'Edit mode enabled.' };
      }

      return { success: false, message: message || 'Invalid credentials.' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Unable to log in right now.',
      };
    }
  };

  const logout = () => {
    api.setAuthToken(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    }
    setIsAuthenticated(false);
    setIsEditMode(false);
  };

  const updateContentValue = async (contentId, value) => {
    try {
      await api.updateContent(contentId, value);
      setContent(prev => ({
        ...prev,
        [contentId]: value
      }));
      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      return false;
    }
  };

  const addProject = async (project) => {
    try {
      const response = await api.createProject(project);
      setPortfolio(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProjectData = async (projectId, projectData) => {
    try {
      await api.updateProject(projectId, projectData);
      await loadPortfolio();
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const removeProject = async (projectId) => {
    try {
      await api.deleteProject(projectId);
      setPortfolio(prev => prev.filter(p => p.project_id !== projectId));
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const value = {
    isEditMode,
    setIsEditMode,
    isAuthenticated,
    content,
    portfolio,
    isLoadingPortfolio,
    login,
    logout,
    updateContentValue,
    addProject,
    updateProjectData,
    removeProject,
    loadContent,
    loadPortfolio,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};
