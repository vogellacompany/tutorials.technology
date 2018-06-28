package com.vogella.eclipse.jgitexamples;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Set;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Ref;

public class JGitUsageExample {

	public static void main(String[] args) throws IOException, IllegalStateException, GitAPIException {
		File localPath = File.createTempFile("JGitTestRepository", "");
		// delete repository before running this
		Files.delete(localPath.toPath());

		// This code would allow to access an existing repository
//		try (Git git = Git.open(new File("/home/vogella/git/eclipse.platform.ui"))) {
//			Repository repository = git.getRepository();
//
//		}

		// Create the git repository with init
		try (Git git = Git.init().setDirectory(localPath).call()) {
			System.out.println("Created repository: " + git.getRepository().getDirectory());
			File myFile = new File(git.getRepository().getDirectory().getParent(), "testfile");
			if (!myFile.createNewFile()) {
				throw new IOException("Could not create file " + myFile);
			}

			// run the add-call
			git.add().addFilepattern("testfile").call();

			git.commit().setMessage("Initial commit").call();
			System.out.println("Committed file " + myFile + " to repository at " + git.getRepository().getDirectory());
			// Create a few branches for testing
			for (int i = 0; i < 10; i++) {
				git.checkout().setCreateBranch(true).setName("new-branch" + i).call();
			}
			// List all branches
			List<Ref> call = git.branchList().call();
			for (Ref ref : call) {
				System.out.println("Branch: " + ref + " " + ref.getName() + " " + ref.getObjectId().getName());
			}

			// Create a few new files
			for (int i = 0; i < 10; i++) {
				File f = new File(git.getRepository().getDirectory().getParent(), "testfile" + i);
				f.createNewFile();
				if (i % 2 == 0) {
					git.add().addFilepattern("testfile" + i).call();
				}
			}

			Status status = git.status().call();

			Set<String> added = status.getAdded();
			for (String add : added) {
				System.out.println("Added: " + add);
			}
			Set<String> uncommittedChanges = status.getUncommittedChanges();
			for (String uncommitted : uncommittedChanges) {
				System.out.println("Uncommitted: " + uncommitted);
			}

			Set<String> untracked = status.getUntracked();
			for (String untrack : untracked) {
				System.out.println("Untracked: " + untrack);
			}

			// Find the head for the repository
			ObjectId lastCommitId = git.getRepository().resolve(Constants.HEAD);
			System.out.println("Head points to the following commit :" + lastCommitId.getName());
		}

	}
}
