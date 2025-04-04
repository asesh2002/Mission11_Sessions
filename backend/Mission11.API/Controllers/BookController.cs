using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Mission11.API.Data;

namespace Mission11.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private BookDbContext _bookcontext;

    public BookController(BookDbContext temp) => _bookcontext = temp;

    [HttpGet("AllBooks")]
    public IActionResult GetBooks(
        int pageSize = 10,
        int pageNum = 1,
        string sortBy = "Title",
        bool descending = false,
        [FromQuery(Name = "bookCategories")] List<string>? bookCategories = null)
    {
        IQueryable<Book> query = _bookcontext.Books;

        //Filter by selected categories
        if (bookCategories != null && bookCategories.Any())
        {
            query = query.Where(b => bookCategories.Contains(b.Category));
        }

        // Sorting
        sortBy = sortBy.ToLower();
        query = sortBy switch
        {
            "title" => descending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title),
            _ => query.OrderBy(b => b.Title)
        };

        var display = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var totalBooks = query.Count(); // filtered count

        return Ok(new
        {
            Books = display,
            TotalNumBooks = totalBooks
        });
    }


    [HttpGet("GetBookTypes")]
    public IActionResult GetBookTypes()
    {
        var categories = _bookcontext.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }

    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _bookcontext.Books.Add(newBook);
        _bookcontext.SaveChanges();
        return Ok(newBook);
    }

    [HttpPut("UpdateBook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _bookcontext.Books.Find(bookId);
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;
            
        _bookcontext.Books.Update(existingBook);
        _bookcontext.SaveChanges();
        
        return Ok(existingBook);
    }

    [HttpDelete("DeleteBook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _bookcontext.Books.Find(bookId);
        if (book == null)
        {
            return NotFound(new { message = "Book not found." });
        }
        
        _bookcontext.Books.Remove(book);
        _bookcontext.SaveChanges();
        
        return NoContent();
    }
    
    
}