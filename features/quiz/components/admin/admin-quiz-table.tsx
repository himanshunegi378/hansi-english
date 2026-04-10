import Link from "next/link";
import { Edit3, Eye, MoreHorizontal, Send, TimerReset, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { QuizStatusBadge } from "../shared/quiz-badges";
import type { QuizUiRecord } from "../../types/ui";

/**
 * Renders the admin quiz table with row-level actions.
 * @param props Quiz rows to display.
 * @returns Styled admin table and pagination.
 */
export function AdminQuizTable({ quizzes }: { quizzes: QuizUiRecord[] }) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/85 p-3 shadow-sm sm:p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quiz</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Structure</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Pass mark</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell className="whitespace-normal">
                <div className="flex max-w-md flex-col gap-1">
                  <Link href={`/admin/quizzes/${quiz.id}/edit`} className="font-medium text-foreground transition-opacity hover:opacity-75">
                    {quiz.title}
                  </Link>
                  <p className="text-sm leading-6 text-muted-foreground">{quiz.description}</p>
                </div>
              </TableCell>
              <TableCell><QuizStatusBadge status={quiz.status} /></TableCell>
              <TableCell>{quiz.sectionCount} sections · {quiz.questionCount} questions</TableCell>
              <TableCell>{quiz.timeLimitMin} min</TableCell>
              <TableCell>{quiz.passingScore}%</TableCell>
              <TableCell>{quiz.updatedAt}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="rounded-full" aria-label={`Open actions for ${quiz.title}`} />}>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl">
                    <DropdownMenuGroup>
                      <DropdownMenuItem render={<Link href={`/admin/quizzes/${quiz.id}/edit`} />}>
                        <Edit3 data-icon="inline-start" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href={`/admin/quizzes/${quiz.id}/preview`} />}>
                        <Eye data-icon="inline-start" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send data-icon="inline-start" />
                        Publish
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TimerReset data-icon="inline-start" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        <Trash2 data-icon="inline-start" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="border-t border-border/60 pt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
