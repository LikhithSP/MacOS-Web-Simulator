import { CodeXml } from "lucide-react";

export default function ProjectCard({
  title,
  description,
  technologies,
  status,
  image,
  link,
  GithubLink,
  onViewDetail
}) {
  return (
    <div className="bg-black/20 backdrop-blur-xl border  border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">

      <div className="w-full h-40 bg-gradient-to-r from-pink-500 to-purple-500 relative">
        <img src={image} className="w-full h-full object-cover opacity-90" alt={title} />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center">
          <h2 onClick={onViewDetail} className="text-lg font-bold cursor-pointer file: text-white">{title}</h2>

          <div className="flex gap-4">
            <span className="text-white/60 text-xl cursor-pointer" onClick={() => window.open(GithubLink)}>
              <CodeXml />
            </span>
            <span className="text-white/60 text-xl cursor-pointer" onClick={() => window.open(link)}>
              🌐
            </span>
          </div>
        </div>

        <p className="text-white/60 text-sm mt-2">{description}</p>

        <div className="mt-3">
          <p className="text-white font-medium mb-1 text-sm">Technologies</p>

          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, i) => (
              <span key={i} className="px-2 py-1 text-xs rounded-lg bg-white/10 border border-white/10 text-white/80">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-5">
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              status === "ALL DONE"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {status === "ALL DONE" ? "✅ ALL DONE" : "🚧 BUILDING"}
          </span>

          <button onClick={onViewDetail} className="text-white underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
