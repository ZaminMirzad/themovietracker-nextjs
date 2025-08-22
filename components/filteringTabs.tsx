export default function FilteringTabs({
  setActiveTab,
  activeTab,
}: {
  setActiveTab: (
    tab: "all" | "currently" | "suggested" | "previously" | "tv",
  ) => void;
  activeTab: string;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex gap-1 sm:gap-2 mb-4 flex-wrap overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
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
        <TabButton
          label="TV Shows"
          isActive={activeTab === "tv"}
          onClick={() => setActiveTab("tv")}
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
      className={`px-3 py-2 sm:py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
        isActive
          ? "bg-dark-accent text-white shadow-lg scale-105"
          : "dark:bg-dark-background dark:text-light-foreground text-light-foreground bg-light-background hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );
}
