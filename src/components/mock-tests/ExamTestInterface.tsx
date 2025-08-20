// src/components/mock-tests/ExamTestInterface.tsx
"use client";

import { useState } from "react";
import { TestList } from "./TestList";
import { TestListTabs } from "./TestListTabs";

export const ExamTestInterface = () => {
    const [activeTab, setActiveTab] = useState("Previous Year Questions");

    return (
        <div>
            <TestListTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <TestList testType={activeTab} />
        </div>
    );
};