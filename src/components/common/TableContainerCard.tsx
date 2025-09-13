import Link from "next/link";
import React from "react";

interface TableContainerCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  addButton?: boolean; // Add button
  addButtonText?:string
  addButtonAction?: () => void
  addButtonClassName?: string
  addButtonLink?:string
}

const TableContainerCard: React.FC<TableContainerCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  addButton = false,
  addButtonText = 'Add',
  addButtonAction,
  addButtonClassName ='',
  addButtonLink
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-3 flex justify-between items-start">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {/* add button */}
        {addButton && addButtonLink ?  (
          <Link href={addButtonLink} className={`px-3 py-1 bg-brand-500 text-sm text-white rounded ${addButtonClassName}`} > {addButtonText}</Link>
        ) :           <button className={`px-3 py-1 bg-brand-500 text-sm text-white rounded ${addButtonClassName}`} onClick={addButtonAction} > {addButtonText}</button>
}
      </div>
      
      {/* Card Body */}
      <div className="p-0 pt-4 border-t border-gray-100 dark:border-gray-800 ">
        <div >{children}</div>
      </div>
    </div>
  );
};

export default TableContainerCard;
