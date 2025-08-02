import ProjectCardHorizontal from '@/components/ProjectCardHorizontal'
import ContentRenderer from '@/components/ContentRenderer'
import ProfileDetails from "@/components/ProfileDetails";

const Layout = ({ projects, github }) => {
  return (
    <div className="mx-auto p-3 md:p-6 lg:p-12">
      <ContentRenderer source={projects} />
      <div className="prose prose-headings:mb-4 dark:prose-invert">
        <ProfileDetails />
        <div className="mt-4 grid gap-4 md:mt-12 md:gap-6">
          <ContentRenderer source={projects} />
          {projects?.collection?.records?.map((item, i) => (
            <ProjectCardHorizontal key={item.slug} index={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Layout
