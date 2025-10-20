// AIGenerationLoader component
interface AIGenerationLoaderProps {
  type?: string;
  prompt?: string;
  onComplete?: () => void;
}

export default function AIGenerationLoader({ type, prompt }: AIGenerationLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
      <h2 className="text-xl font-semibold mb-2">Generating {type || 'content'}...</h2>
      <p className="text-gray-600 text-center">{prompt || 'Please wait while we process your request.'}</p>
    </div>
  );
}

