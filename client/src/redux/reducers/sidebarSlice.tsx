import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
    isOpen: boolean;
}

const initialState: SidebarState = {
    isOpen: false
}
const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isOpen = !state.isOpen; // Toggle sidebar open/close
        },
        openSidebar: (state) => {
            state.isOpen = true; // Open the sidebar
        },
        closeSidebar: (state) => {
            state.isOpen = false; // Close the sidebar
        },
    },
});

export const { toggleSidebar, openSidebar, closeSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;