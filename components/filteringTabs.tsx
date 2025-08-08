export default function FilteringTabs({
  setActiveTab,
  activeTab,
}: {
  setActiveTab: (tab: "all" | "currently" | "suggested" | "previously") => void;
  activeTab: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        <TabButton
          label="All"
          isActive={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        />
        <TabButton
          label="Currently Watching"
          isActive={activeTab === "currently"}
          onClick={() => setActiveTab("currently")}
        />
        <TabButton
          label="Suggested"
          isActive={activeTab === "suggested"}
          onClick={() => setActiveTab("suggested")}
        />
        <TabButton
          label="Previously Watched"
          isActive={activeTab === "previously"}
          onClick={() => setActiveTab("previously")}
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm ${
        isActive
          ? "bg-dark-accent text-white"
          : "dark:bg-dark-background dark:text-light-foreground text-light-foreground bg-light-background"
      }`}
    >
      {label}
    </button>
  );
}
