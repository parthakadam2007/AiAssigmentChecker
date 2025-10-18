import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teacherStatus: {
    teacherId: "",
    name: "",
    email: "",
  },
  sidebarStatus: {
    activePage: "Home",
    isOpen: false,
  },
  classesStatus: {
    classesData: [],
    loading: false,
    error: null,
  },
  currentClass: {
    class_id: "",
  },
  tabStatus: {
    activeTab: "Section",
  },
  assignmentCreateStatus: {
    title: "",
    description: "",
    evaluation_guideline: "",
    points: 100,
    deadline: "",
  },
  assignmentUploadHandle: {
    ReadyToUpload: false,
    assignment_id: "",
  },
};

export const sharedSlice = createSlice({
  name: "sharedSlice",
  initialState,
  reducers: {
    // ---------------- Teacher ----------------
    setTeacherStatus: (state, action) => {
      state.teacherStatus = {
        teacherId: action.payload.teacherId,
        name: action.payload.name || "",
        email: action.payload.email || "",
      };
    },
    clearTeacherStatus: (state) => {
      state.teacherStatus = { teacherId: "", name: "", email: "" };
      state.classesStatus = {
        ...state.classesStatus,
        classesData: [],
        loading: false,
        error: null,
      };
    },

    // ---------------- Sidebar ----------------
    updatesidebarStatus: (state, action) => {
      state.sidebarStatus.activePage = action.payload.activePage;
    },
    toggleSidebar: (state) => {
      state.sidebarStatus.isOpen = !state.sidebarStatus.isOpen;
    },
    openSidebar: (state) => {
      state.sidebarStatus.isOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarStatus.isOpen = false;
    },

    // ---------------- Classes ----------------
    updateClassesStatus: (state, action) => {
    state.classesStatus = {
        ...state.classesStatus,
        classesData: action.payload.classesData ?? state.classesStatus.classesData,
        loading: action.payload.loading ?? state.classesStatus.loading,
        error: action.payload.error ?? state.classesStatus.error,
    };
    },

    // ---------------- Tab ----------------
    updateTabStatus: (state, action) => {
      state.tabStatus.activeTab = action.payload.activePage;
    },

    // ---------------- Current Class ----------------
    updateCurrentClass: (state, action) => {
      state.currentClass = { class_id: action.payload.class_id };
    },

    // ---------------- Assignment ----------------
    updateAssignmentCreateStatus: (state, action) => {
      state.assignmentCreateStatus = { ...action.payload };
    },
    updateAssignmentUploadHandle: (state, action) => {
      state.assignmentUploadHandle = { ...action.payload };
    },
  },
});

export const {
  setTeacherStatus,
  clearTeacherStatus,
  updatesidebarStatus,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  updateClassesStatus,
  updateTabStatus,
  updateCurrentClass,
  updateAssignmentCreateStatus,
  updateAssignmentUploadHandle,
} = sharedSlice.actions;

export default sharedSlice.reducer;
